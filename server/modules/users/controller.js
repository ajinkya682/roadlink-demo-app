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
        phone: user.phone,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      }
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    return sendError(res, 'Failed to fetch user profile', 500);
  }
};
