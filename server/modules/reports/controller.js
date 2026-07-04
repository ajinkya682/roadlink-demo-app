const Report = require('../../models/Report');
const QrToken = require('../../models/QrToken');
const Vehicle = require('../../models/Vehicle');
const { sendSuccess, sendError } = require('../../utils/response');
const { verifyQRToken } = require('../../utils/hmac');
const notificationService = require('./notificationService');
const { logger } = require('../../middleware/logger');

exports.createReport = async (req, res) => {
  try {
    const { qrToken: token, category, notes, reporterLocation, mediaUrls } = req.body;

    if (!token || !category) {
      return sendError(res, 'qrToken and category are required');
    }

    const qrTokenDoc = await QrToken.findOne({ token, active: true });
    if (!qrTokenDoc) return sendError(res, 'Invalid or inactive QR token', 404);

    const vehicleId = verifyQRToken(token);
    if (!vehicleId || vehicleId !== qrTokenDoc.vehicleId.toString()) {
      return sendError(res, 'Tampered QR token', 400);
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status === 'deleted') {
      return sendError(res, 'Vehicle not found', 404);
    }

    // Rate limits (Emergency/Theft exempt handled via middleware or application logic)
    // Create the report
    const report = new Report({
      vehicleId,
      category,
      reporterDeviceId: req.ip, // Basic anonymized fingerprinting
      reporterLocation,
      notes,
      mediaUrls
    });

    await report.save();

    // Trigger notification asynchronously (fire-and-forget)
    notificationService.orchestrate(report).catch(err => 
      logger.error('Unhandled error in notification orchestrator:', err)
    );

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

    const reports = await Report.find(query).sort({ createdAt: -1 });

    return sendSuccess(res, { reports });
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
