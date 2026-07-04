const Document = require('../../models/Document');
const Vehicle = require('../../models/Vehicle');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');

exports.uploadDocument = async (req, res) => {
  try {
    const { vehicleId, type, expiryDate } = req.body;

    if (!req.file) return sendError(res, 'File is required');
    if (!vehicleId || !type) return sendError(res, 'vehicleId and type are required');

    const validTypes = ['RC Book', 'Insurance', 'PUC', 'Driving License'];
    if (!validTypes.includes(type)) {
      return sendError(res, 'Invalid document type for MVP');
    }

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: req.user.userId, status: { $ne: 'deleted' } });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);

    // Simulate S3/encrypted URL via local path
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Default reminder schedule if expiry is provided
    let reminderSchedule = [];
    if (expiryDate) {
      reminderSchedule = [30, 15, 7, 1];
    }

    const document = new Document({
      vehicleId,
      ownerId: req.user.userId,
      type,
      fileUrl,
      expiryDate,
      reminderSchedule
    });

    await document.save();

    return sendSuccess(res, { document }, 201);
  } catch (error) {
    logger.error('Error uploading document:', error);
    return sendError(res, 'Failed to upload document', 500);
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { vehicleId } = req.query;

    let query = { ownerId: req.user.userId };
    if (vehicleId) {
      // Verify ownership
      const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: req.user.userId, status: { $ne: 'deleted' } });
      if (!vehicle) return sendError(res, 'Vehicle not found', 404);
      query.vehicleId = vehicleId;
    }

    const documents = await Document.find(query);
    
    // In MVP, we might simulate short-lived signed URLs. Since it's local, we just return the path.
    return sendSuccess(res, { documents });
  } catch (error) {
    return sendError(res, 'Failed to fetch documents', 500);
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findOneAndDelete({ _id: id, ownerId: req.user.userId });
    if (!document) return sendError(res, 'Document not found', 404);

    // TODO: Actually remove the file from disk/S3 here
    // fs.unlinkSync(path.join(__dirname, '../../../', document.fileUrl));

    return sendSuccess(res, { message: 'Document deleted successfully' });
  } catch (error) {
    return sendError(res, 'Failed to delete document', 500);
  }
};
