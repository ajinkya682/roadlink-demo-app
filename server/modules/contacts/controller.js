const EmergencyContact = require('../../models/EmergencyContact');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');

exports.addContact = async (req, res) => {
  try {
    const { name, phone, priority, relation, isPrimary } = req.body;
    const userId = req.user.userId;
    
    if (!name || !phone) {
      return sendError(res, 'name and phone are required');
    }

    const session = await EmergencyContact.startSession();
    session.startTransaction();

    try {
      let finalPriority = priority || (isPrimary ? 1 : 2);

      if (finalPriority === 1) {
        // Demote existing primary contact if a new one is set to priority 1
        await EmergencyContact.updateMany(
          { userId, priority: 1 },
          { $set: { priority: 2 } },
          { session }
        );
      }

      const contact = new EmergencyContact({
        userId,
        name,
        phone,
        priority: finalPriority,
        relation
      });
      await contact.save({ session });
      
      await session.commitTransaction();
      session.endSession();

      // Return it mapped slightly for the frontend (or just the raw object, frontend maps it)
      return sendSuccess(res, { 
        contact: {
          _id: contact._id,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relation,
          isPrimary: contact.priority === 1
        }
      }, 201);
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
    const userId = req.user.userId;

    const contacts = await EmergencyContact.find({ userId }).sort({ priority: 1, createdAt: -1 });
    
    // Map to what frontend expects
    const mappedContacts = contacts.map(c => ({
      _id: c._id,
      name: c.name,
      phone: c.phone,
      relationship: c.relation,
      isPrimary: c.priority === 1
    }));
    
    return sendSuccess(res, { contacts: mappedContacts });
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    return sendError(res, 'Failed to fetch contacts', 500);
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, isPrimary, name, phone, relationship } = req.body;
    const userId = req.user.userId;

    const contact = await EmergencyContact.findById(id);
    if (!contact) return sendError(res, 'Contact not found', 404);
    if (contact.userId.toString() !== userId.toString()) return sendError(res, 'Unauthorized', 403);

    const finalPriority = isPrimary !== undefined ? (isPrimary ? 1 : 2) : priority;

    if (finalPriority === 1 && contact.priority !== 1) {
      const session = await EmergencyContact.startSession();
      session.startTransaction();
      try {
        await EmergencyContact.updateMany(
          { userId, priority: 1 },
          { $set: { priority: 2 } },
          { session }
        );
        const updated = await EmergencyContact.findByIdAndUpdate(id, { 
          $set: { name, phone, relation: relationship, priority: 1 } 
        }, { new: true, session });
        await session.commitTransaction();
        session.endSession();
        return sendSuccess(res, { contact: updated });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    } else {
      const updates = { name, phone, relation: relationship };
      if (finalPriority !== undefined) updates.priority = finalPriority;

      // Remove undefined values
      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

      const updated = await EmergencyContact.findByIdAndUpdate(id, { $set: updates }, { new: true });
      return sendSuccess(res, { contact: updated });
    }
  } catch (error) {
    logger.error('Error updating contact:', error);
    return sendError(res, 'Failed to update contact', 500);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const contact = await EmergencyContact.findById(id);
    if (!contact) return sendError(res, 'Contact not found', 404);
    if (contact.userId.toString() !== userId.toString()) return sendError(res, 'Unauthorized', 403);

    await EmergencyContact.findByIdAndDelete(id);

    return sendSuccess(res, { message: 'Contact deleted successfully' });
  } catch (error) {
    logger.error('Error deleting contact:', error);
    return sendError(res, 'Failed to delete contact', 500);
  }
};
