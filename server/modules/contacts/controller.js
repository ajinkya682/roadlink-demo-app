const EmergencyContact = require('../../models/EmergencyContact');
const Vehicle = require('../../models/Vehicle');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');

// Middleware helper to verify vehicle ownership
const verifyVehicleOwnership = async (vehicleId, userId) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: userId, status: { $ne: 'deleted' } });
  return !!vehicle;
};

exports.addContact = async (req, res) => {
  try {
    const { vehicleId, name, phone, priority, relation } = req.body;
    
    if (!vehicleId || !name || !phone) {
      return sendError(res, 'vehicleId, name, and phone are required');
    }

    const isOwner = await verifyVehicleOwnership(vehicleId, req.user.userId);
    if (!isOwner) return sendError(res, 'Vehicle not found or unauthorized', 404);

    const session = await EmergencyContact.startSession();
    session.startTransaction();

    try {
      if (priority === 1) {
        // Demote existing primary contact if a new one is set to priority 1
        await EmergencyContact.updateMany(
          { vehicleId, priority: 1 },
          { $set: { priority: 2 } },
          { session }
        );
      }

      const contact = new EmergencyContact({
        vehicleId,
        name,
        phone,
        priority: priority || 2,
        relation
      });
      await contact.save({ session });
      
      await session.commitTransaction();
      session.endSession();

      return sendSuccess(res, { contact }, 201);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    logger.error('Error adding contact:', error);
    return sendError(res, 'Failed to add emergency contact', 500);
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    if (!vehicleId) return sendError(res, 'vehicleId query param is required');

    const isOwner = await verifyVehicleOwnership(vehicleId, req.user.userId);
    if (!isOwner) return sendError(res, 'Vehicle not found or unauthorized', 404);

    const contacts = await EmergencyContact.find({ vehicleId }).sort({ priority: 1, createdAt: -1 });
    return sendSuccess(res, { contacts });
  } catch (error) {
    return sendError(res, 'Failed to fetch contacts', 500);
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const contact = await EmergencyContact.findById(id);
    if (!contact) return sendError(res, 'Contact not found', 404);

    const isOwner = await verifyVehicleOwnership(contact.vehicleId, req.user.userId);
    if (!isOwner) return sendError(res, 'Unauthorized', 403);

    if (priority === 1 && contact.priority !== 1) {
      const session = await EmergencyContact.startSession();
      session.startTransaction();
      try {
        await EmergencyContact.updateMany(
          { vehicleId: contact.vehicleId, priority: 1 },
          { $set: { priority: 2 } },
          { session }
        );
        const updated = await EmergencyContact.findByIdAndUpdate(id, { $set: req.body }, { new: true, session });
        await session.commitTransaction();
        session.endSession();
        return sendSuccess(res, { contact: updated });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    } else {
      const updated = await EmergencyContact.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      return sendSuccess(res, { contact: updated });
    }
  } catch (error) {
    return sendError(res, 'Failed to update contact', 500);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await EmergencyContact.findById(id);
    if (!contact) return sendError(res, 'Contact not found', 404);

    const isOwner = await verifyVehicleOwnership(contact.vehicleId, req.user.userId);
    if (!isOwner) return sendError(res, 'Unauthorized', 403);

    await EmergencyContact.findByIdAndDelete(id);

    return sendSuccess(res, { message: 'Contact deleted successfully' });
  } catch (error) {
    return sendError(res, 'Failed to delete contact', 500);
  }
};
