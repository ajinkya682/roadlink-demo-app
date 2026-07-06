const Report = require('../../models/Report');
const QrToken = require('../../models/QrToken');
const Vehicle = require('../../models/Vehicle');
const { sendSuccess, sendError } = require('../../utils/response');
const notificationService = require('./notificationService');
const { logger } = require('../../middleware/logger');

const { uploadBuffer, getSignedUrl, extractPublicId } = require('../../services/cloudinary');

exports.createReport = async (req, res) => {
  try {
    const { qrToken: token, category, notes, mediaUrls } = req.body;
    let reporterLocation = req.body.reporterLocation;
    
    if (typeof reporterLocation === 'string') {
      try {
        reporterLocation = JSON.parse(reporterLocation);
      } catch(e) {}
    }

    if (!token || !category) {
      return sendError(res, 'qrToken and category are required');
    }

    if (token === 'RL-123456-DF' || token === 'ROADLINK-SIMULATED123') {
      return sendSuccess(res, {
        reportId: 'demo-report-id',
        status: 'pending'
      }, 201);
    }

    const qrTokenDoc = await QrToken.findOne({ token, active: true });
    if (!qrTokenDoc) return sendError(res, 'Invalid or inactive QR token', 404);

    const vehicleId = qrTokenDoc.vehicleId.toString();

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status === 'deleted') {
      return sendError(res, 'Vehicle not found', 404);
    }
    
    let uploadedMediaUrls = mediaUrls ? (Array.isArray(mediaUrls) ? mediaUrls : [mediaUrls]) : [];
    
    if (req.file) {
      try {
        const result = await uploadBuffer(req.file.buffer, 'roadlink/reports', 'image');
        uploadedMediaUrls.push(result.secure_url || result.url || result.public_id);
      } catch (uploadError) {
        logger.error('Failed to upload report image', uploadError);
      }
    }

    // Rate limits (Emergency/Theft exempt handled via middleware or application logic)
    // Create the report
    const report = new Report({
      vehicleId,
      category,
      reporterDeviceId: req.ip, // Basic anonymized fingerprinting
      reporterLocation,
      notes,
      mediaUrls: uploadedMediaUrls
    });

    await report.save();

    // Trigger notification asynchronously (fire-and-forget)
    notificationService.orchestrate(report).catch(err => 
      logger.error('Unhandled error in notification orchestrator:', err)
    );

    // Emit Real-Time SSE Notification to the vehicle owner
    try {
      const sseManager = require('../../utils/sseManager');
      let categoryLabel = 'Alert';
      let emoji = '🔔';
      if (report.category === 'wrong_parking') { categoryLabel = 'Wrong Parking'; emoji = '🅿️'; }
      else if (report.category === 'theft') { categoryLabel = 'Vehicle Theft'; emoji = '🚨'; }
      else if (report.category === 'emergency') { categoryLabel = 'Emergency'; emoji = '⚠️'; }

      sseManager.sendToUser(vehicle.ownerId, 'NOTIFICATION_CREATED', {
        id: report._id,
        type: categoryLabel,
        emoji: emoji,
        category: report.category,
        categoryId: report.category,
        title: `Report on ${vehicle.registrationNumber || 'Vehicle'}`,
        plate: vehicle.registrationNumber || 'UNKNOWN',
        message: report.message,
        notes: report.notes || '',
        timestamp: report.createdAt,
        time: 'Just now',
        read: false,
        resolved: false,
        vehicleId: vehicle._id,
        mediaUrls: uploadedMediaUrls,
        reporterLocation: report.reporterLocation || null,
        isAlert: report.category === 'theft' || report.category === 'emergency'
      });
    } catch(err) {
      logger.error('Failed to emit SSE for notification', err);
    }

    return sendSuccess(res, {
      reportId: report._id,
      status: report.status
    }, 201);
  } catch (error) {
    logger.error('Error creating report:', error);
    return sendError(res, 'Failed to submit report', 500);
  }
};

exports.getReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find all vehicles owned by this user
    const vehicles = await Vehicle.find({ ownerId: userId }, '_id');
    const vehicleIds = vehicles.map(v => v._id);

    const statusFilter = req.query.status; // e.g. "resolved"
    const query = { vehicleId: { $in: vehicleIds } };
    if (statusFilter) {
      if (statusFilter === 'unresolved') {
        query.status = { $nin: ['resolved'] };
      } else {
        query.status = statusFilter;
      }
    }

    const reports = await Report.find(query).populate('vehicleId').sort({ createdAt: -1 });

    const signedReports = reports.map(r => {
      const rObj = r.toObject();
      if (rObj.mediaUrls && rObj.mediaUrls.length > 0) {
        rObj.mediaUrls = rObj.mediaUrls.map(url => {
           const publicId = extractPublicId(url);
           if (publicId) return getSignedUrl(publicId) || url;
           return url;
        });
      }
      return rObj;
    });

    return sendSuccess(res, { reports: signedReports });
  } catch (error) {
    return sendError(res, 'Failed to fetch reports', 500);
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Status transitions allowed: 'resolved', 'escalated'
    if (!['resolved', 'escalated'].includes(status)) {
      return sendError(res, 'Invalid status transition');
    }

    const report = await Report.findById(id).populate('vehicleId');
    if (!report) return sendError(res, 'Report not found', 404);

    if (report.vehicleId.ownerId.toString() !== req.user.userId) {
      return sendError(res, 'Forbidden', 403);
    }

    report.status = status;
    if (status === 'resolved') {
      report.resolvedAt = new Date();
    }
    await report.save();

    return sendSuccess(res, { report });
  } catch (error) {
    return sendError(res, 'Failed to update report', 500);
  }
};
