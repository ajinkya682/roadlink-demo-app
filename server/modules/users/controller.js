const User = require('../../models/User');
const Document = require('../../models/Document');
const Vehicle = require('../../models/Vehicle');
const Report = require('../../models/Report');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');
const { uploadBuffer, extractPublicId, deleteResource } = require('../../services/cloudinary');

exports.updateSettings = async (req, res) => {
  try {
    const { notificationPrefs, privacyPrefs } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    if (notificationPrefs) {
      for (const key in notificationPrefs) {
        user.notificationPrefs[key] = notificationPrefs[key];
      }
    }
    if (privacyPrefs) {
      for (const key in privacyPrefs) {
        user.privacyPrefs[key] = privacyPrefs[key];
      }
    }
    
    await user.save();
    
    return sendSuccess(res, { 
      notificationPrefs: user.notificationPrefs,
      privacyPrefs: user.privacyPrefs
    });
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
        notificationPrefs: user.notificationPrefs,
        privacyPrefs: user.privacyPrefs,
        medicalProfile: user.medicalProfile,
        savedAddresses: user.savedAddresses || []
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
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);

    // 1. Delete profile image from Cloudinary
    if (user.avatarUrl) {
      const publicId = extractPublicId(user.avatarUrl);
      if (publicId) {
        await deleteResource(publicId).catch(err => logger.error('Failed to delete avatar from Cloudinary', err));
      }
    }

    // 2. Delete all document files from Cloudinary
    const documents = await Document.find({ ownerId: userId });
    for (const doc of documents) {
      if (doc.fileUrl) {
         const publicId = extractPublicId(doc.fileUrl);
         if (publicId) {
            await deleteResource(publicId).catch(err => logger.error('Failed to delete doc from Cloudinary', err));
         }
      }
    }
    
    // 3. Delete documents from DB
    await Document.deleteMany({ ownerId: userId });

    // 4. Cascade delete Vehicles, their Reports, and their respective Cloudinary images
    const vehicles = await Vehicle.find({ ownerId: userId });
    for (const vehicle of vehicles) {
      // Delete vehicle image from Cloudinary
      if (vehicle.imageUrl) {
        const publicId = extractPublicId(vehicle.imageUrl);
        if (publicId) {
          await deleteResource(publicId).catch(err => logger.error('Failed to delete vehicle image from Cloudinary', err));
        }
      }

      // Find reports for this vehicle
      const reports = await Report.find({ vehicleId: vehicle._id });
      for (const report of reports) {
        // Delete all report media from Cloudinary
        if (report.mediaUrls && report.mediaUrls.length > 0) {
          for (const url of report.mediaUrls) {
            const publicId = extractPublicId(url);
            if (publicId) {
              await deleteResource(publicId).catch(err => logger.error('Failed to delete report media from Cloudinary', err));
            }
          }
        }
      }

      // Delete reports from DB
      await Report.deleteMany({ vehicleId: vehicle._id });
    }

    // 5. Delete vehicles from DB
    await Vehicle.deleteMany({ ownerId: userId });
    
    // 6. Delete User from DB
    await User.findByIdAndDelete(userId);
    
    return sendSuccess(res, { message: 'Account deleted successfully, including all data and files' });
  } catch (error) {
    logger.error('Error deleting account:', error);
    return sendError(res, 'Failed to delete account', 500);
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, address, medicalProfile } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (medicalProfile) {
      user.medicalProfile = { ...user.medicalProfile, ...medicalProfile };
    }
    // address is not in schema yet, but we'll accept it
    
    if (req.file) {
      // Upload to Cloudinary (public image)
      const result = await uploadBuffer(req.file.buffer, 'roadlink/profiles', 'image', false);
      user.avatarUrl = result.secure_url;
    } else if (req.body.avatarUrl && req.body.avatarUrl.startsWith('data:image')) {
      // Handle base64 image upload from Capacitor client
      try {
        const base64Data = req.body.avatarUrl.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadRes = await uploadBuffer(buffer, 'roadlink/profiles', 'image', false);
        
        // Delete old image if exists
        if (user.avatarUrl) {
          const publicId = extractPublicId(user.avatarUrl);
          if (publicId) await deleteResource(publicId, 'image').catch(e => logger.error('Cloudinary delete failed', e));
        }
        
        user.avatarUrl = uploadRes.secure_url;
      } catch (err) {
        logger.error('Failed to upload base64 avatar', err);
      }
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
        notificationPrefs: user.notificationPrefs,
        privacyPrefs: user.privacyPrefs,
        medicalProfile: user.medicalProfile,
        savedAddresses: user.savedAddresses || []
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};

exports.registerDeviceToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { token, platform, deviceId } = req.body;

    if (!token || !platform || !deviceId) {
      return sendError(res, 'Token, platform, and deviceId are required', 400);
    }

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);

    if (!user.deviceTokens) {
      user.deviceTokens = [];
    }

    // Check if deviceId already exists
    const existingIndex = user.deviceTokens.findIndex(dt => dt.deviceId === deviceId);
    
    if (existingIndex > -1) {
      // Update existing device token
      user.deviceTokens[existingIndex].token = token;
      user.deviceTokens[existingIndex].platform = platform;
      user.deviceTokens[existingIndex].lastUsed = new Date();
    } else {
      // Also prevent the exact same token string being used across different device IDs (edge case)
      user.deviceTokens = user.deviceTokens.filter(dt => dt.token !== token);
      // Add new token
      user.deviceTokens.push({ token, platform, deviceId, lastUsed: new Date() });
    }

    // Prune old tokens (older than 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    user.deviceTokens = user.deviceTokens.filter(dt => dt.lastUsed >= sixMonthsAgo);

    await user.save();
    
    return sendSuccess(res, { message: 'Device token registered successfully' });
  } catch (error) {
    logger.error('Error registering device token:', error);
    return sendError(res, 'Failed to register device token', 500);
  }
};

exports.deleteDeviceToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { deviceId } = req.params;

    if (!deviceId) return sendError(res, 'Device ID is required', 400);

    await User.updateOne(
      { _id: userId },
      { $pull: { deviceTokens: { deviceId } } }
    );

    return sendSuccess(res, { message: 'Device token removed successfully' });
  } catch (error) {
    logger.error('Error removing device token:', error);
    return sendError(res, 'Failed to remove device token', 500);
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    if (!user.savedAddresses) user.savedAddresses = [];
    
    const duplicateIndex = user.savedAddresses.findIndex(a => 
      a.name === addressData.name && 
      a.line1 === addressData.line1 && 
      (a.line2 || '') === (addressData.line2 || '') && 
      a.city === addressData.city && 
      a.state === addressData.state && 
      a.pincode === addressData.pincode && 
      a.phone === addressData.phone
    );

    if (duplicateIndex > -1) {
      if (addressData.isDefault) {
        user.savedAddresses.forEach(a => a.isDefault = false);
        user.savedAddresses[duplicateIndex].isDefault = true;
      }
      await user.save();
      return sendSuccess(res, { savedAddresses: user.savedAddresses });
    }
    
    if (user.savedAddresses.length >= 3) {
      if (addressData.isDefault) {
        // Find old default and replace it
        const oldDefaultIndex = user.savedAddresses.findIndex(a => a.isDefault === true);
        if (oldDefaultIndex > -1) {
          user.savedAddresses.splice(oldDefaultIndex, 1);
        } else {
          user.savedAddresses.shift();
        }
      } else {
        return sendError(res, 'Maximum of 3 addresses allowed. Please replace an existing one.', 400);
      }
    }
    
    if (addressData.isDefault) {
      user.savedAddresses.forEach(a => a.isDefault = false);
    } else if (user.savedAddresses.length === 0) {
      addressData.isDefault = true;
    }
    
    user.savedAddresses.push(addressData);
    await user.save();
    
    return sendSuccess(res, { savedAddresses: user.savedAddresses });
  } catch (error) {
    logger.error('Error adding address:', error);
    return sendError(res, 'Failed to add address', 500);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const addressData = req.body;
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    const address = user.savedAddresses.id(id);
    if (!address) return sendError(res, 'Address not found', 404);
    
    if (addressData.isDefault && !address.isDefault) {
      user.savedAddresses.forEach(a => a.isDefault = false);
    }
    
    Object.assign(address, addressData);
    await user.save();
    
    return sendSuccess(res, { savedAddresses: user.savedAddresses });
  } catch (error) {
    logger.error('Error updating address:', error);
    return sendError(res, 'Failed to update address', 500);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);
    
    const address = user.savedAddresses.id(id);
    if (!address) return sendError(res, 'Address not found', 404);
    
    const wasDefault = address.isDefault;
    user.savedAddresses.pull(id);
    
    // If we deleted the default and there are others left, make the first one default
    if (wasDefault && user.savedAddresses.length > 0) {
      user.savedAddresses[0].isDefault = true;
    }
    
    await user.save();
    
    return sendSuccess(res, { savedAddresses: user.savedAddresses });
  } catch (error) {
    logger.error('Error deleting address:', error);
    return sendError(res, 'Failed to delete address', 500);
  }
};
