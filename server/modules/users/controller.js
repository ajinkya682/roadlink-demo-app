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
      user.notificationPrefs = { ...user.notificationPrefs, ...notificationPrefs };
    }
    if (privacyPrefs) {
      user.privacyPrefs = { ...user.privacyPrefs, ...privacyPrefs };
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
        medicalProfile: user.medicalProfile
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
        notificationPrefs: user.notificationPrefs,
        privacyPrefs: user.privacyPrefs,
        medicalProfile: user.medicalProfile
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};
