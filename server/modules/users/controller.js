const User = require('../../models/User');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');

exports.updateSettings = async (req, res) => {
  try {
    const { notificationPrefs } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    if (notificationPrefs) {
      user.notificationPrefs = { ...user.notificationPrefs, ...notificationPrefs };
    }
    
    await user.save();
    
    return sendSuccess(res, { notificationPrefs: user.notificationPrefs });
  } catch (error) {
    logger.error('Error updating settings:', error);
    return sendError(res, 'Failed to update settings', 500);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    return sendSuccess(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      }
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    return sendError(res, 'Failed to fetch user profile', 500);
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // In a real app, you might want to also delete associated vehicles, documents, etc.
    // For MVP, deleting the user is the primary step.
    const user = await User.findByIdAndDelete(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    return sendSuccess(res, { message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Error deleting account:', error);
    return sendError(res, 'Failed to delete account', 500);
  }
};

const { uploadBuffer } = require('../../services/cloudinary');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, address } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    if (name) user.name = name;
    if (email) user.email = email;
    // address is not in schema yet, but we'll accept it
    
    if (req.file) {
      // Upload to Cloudinary
      const result = await uploadBuffer(req.file.buffer, 'roadlink/profiles', 'image');
      user.avatarUrl = result.secure_url;
    }
    
    await user.save();
    
    return sendSuccess(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};
