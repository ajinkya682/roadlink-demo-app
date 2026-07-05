const Vehicle = require('../../models/Vehicle');
const QrToken = require('../../models/QrToken');
const { sendSuccess, sendError } = require('../../utils/response');
const { generateQRToken } = require('../../utils/hmac');
const { logger } = require('../../middleware/logger');
const { uploadBuffer, extractPublicId, deleteResource, cloudinary } = require('../../services/cloudinary');

exports.createVehicle = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { registrationNumber, type, make, model, nickname, publicDisplayName, showOwnerName } = req.body;

    if (!registrationNumber) {
      return sendError(res, 'Registration number is required');
    }

    const vehicle = new Vehicle({
      ownerId: userId,
      registrationNumber,
      type: type || 'four-wheeler',
      make,
      model,
      nickname,
      publicDisplayName: publicDisplayName || nickname || make || 'Vehicle',
      showOwnerName: !!showOwnerName
    });

    if (req.file) {
      try {
        const result = await uploadBuffer(req.file.buffer, 'roadlink/vehicles', 'image', false);
        vehicle.imageUrl = result.secure_url;
      } catch (uploadError) {
        logger.error('Failed to upload vehicle image', uploadError);
      }
    }

    await vehicle.save();

    // Do NOT generate QR token here. Wait for payment.
    return sendSuccess(res, {
      vehicle
    }, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'Vehicle with this registration number already exists', 409);
    }
    logger.error('Error creating vehicle:', error);
    return sendError(res, 'Failed to create vehicle', 500);
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const vehicles = await Vehicle.find({ ownerId: userId, status: { $ne: 'deleted' } }).lean();
    
    const vehicleIds = vehicles.map(v => v._id);
    const qrTokens = await QrToken.find({ vehicleId: { $in: vehicleIds }, active: true });
    
    const vehiclesWithTokens = vehicles.map(v => {
      const tokenDoc = qrTokens.find(qt => qt.vehicleId.toString() === v._id.toString());
      return { ...v, qrToken: tokenDoc ? tokenDoc.token : null };
    });

    return sendSuccess(res, { vehicles: vehiclesWithTokens });
  } catch (error) {
    logger.error('Error fetching vehicles:', error);
    return sendError(res, 'Failed to fetch vehicles', 500);
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ _id: id, ownerId: req.user.userId, status: { $ne: 'deleted' } });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);
    
    // Also fetch the active QR token
    const qrToken = await QrToken.findOne({ vehicleId: id, active: true }).sort({ createdAt: -1 });
    
    const vehicleObj = vehicle.toObject();
    vehicleObj.qrToken = qrToken ? qrToken.token : null;
    
    return sendSuccess(res, { vehicle: vehicleObj });
  } catch (error) {
    return sendError(res, 'Failed to fetch vehicle', 500);
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Don't allow changing owner or registration number via generic patch
    delete updates.ownerId;
    delete updates.registrationNumber;

    let existingVehicle = await Vehicle.findOne({ _id: id, ownerId: req.user.userId, status: { $ne: 'deleted' } });
    if (!existingVehicle) return sendError(res, 'Vehicle not found', 404);

    // Handle image upload/removal
    if (updates.imageUrl === null) {
      if (existingVehicle.imageUrl) {
        const publicId = extractPublicId(existingVehicle.imageUrl);
        if (publicId) await deleteResource(publicId, 'image').catch(e => logger.error('Cloudinary delete failed', e));
      }
    } else if (updates.imageUrl && updates.imageUrl.startsWith('data:image/')) {
      // Upload new base64 image to cloudinary
      try {
        const uploadRes = await cloudinary.uploader.upload(updates.imageUrl, {
          folder: 'roadlink/vehicles',
          type: 'upload', // public
          transformation: [{ width: 1600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }]
        });
        updates.imageUrl = uploadRes.secure_url;
        
        // Delete old image if exists
        if (existingVehicle.imageUrl) {
          const publicId = extractPublicId(existingVehicle.imageUrl);
          if (publicId) await deleteResource(publicId, 'image').catch(e => logger.error('Cloudinary delete failed', e));
        }
      } catch (e) {
        logger.error('Cloudinary upload failed', e);
        delete updates.imageUrl; // Don't save the massive base64 string to DB if upload fails
      }
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, ownerId: req.user.userId, status: { $ne: 'deleted' } },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, { vehicle });
  } catch (error) {
    logger.error('Error in updateVehicle:', error);
    return sendError(res, 'Failed to update vehicle', 500);
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ _id: id, ownerId: req.user.userId });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);

    if (vehicle.imageUrl) {
      try {
        const publicId = extractPublicId(vehicle.imageUrl);
        if (publicId) {
          await deleteResource(publicId);
        }
      } catch (err) {
        logger.error('Failed to delete vehicle image from Cloudinary', err);
      }
    }

    await QrToken.deleteMany({ vehicleId: id });
    
    const EmergencyContact = require('../../models/EmergencyContact');
    await EmergencyContact.deleteMany({ vehicleId: id });
    
    const Order = require('../orders/models/Order');
    await Order.deleteMany({ vehicleId: id });
    
    await Vehicle.findByIdAndDelete(id);

    return sendSuccess(res, { message: 'Vehicle deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteVehicle:', error);
    return sendError(res, 'Failed to delete vehicle', 500);
  }
};

// GUEST FACING - No auth
exports.resolveQR = async (req, res) => {
  try {
    const { token, number } = req.query;
    if (!token && !number) return sendError(res, 'Token or registration number is required');

    let vehicle;

    if (token) {
      const qrToken = await QrToken.findOne({ token, active: true });
      if (!qrToken) return sendError(res, 'Invalid or inactive QR token', 404);
      vehicle = await Vehicle.findById(qrToken.vehicleId).populate('ownerId', 'name phone privacyPrefs');
    } else if (number) {
      const cleanNumber = number.replace(/\s+/g, '').toUpperCase();
      vehicle = await Vehicle.findOne({ registrationNumber: cleanNumber }).populate('ownerId', 'name phone privacyPrefs');
    }

    if (!vehicle || vehicle.status === 'deleted') {
      return sendError(res, 'Vehicle not found', 404);
    }

    if (vehicle.protectionStatus === 'lapsed') {
      return sendSuccess(res, { 
        profile: { 
          vehicleId: vehicle._id, 
          status: vehicle.status, 
          protectionStatus: 'lapsed',
          publicDisplayName: vehicle.publicDisplayName,
          ownerName: vehicle.showOwnerName && vehicle.ownerId ? vehicle.ownerId.name : null
        } 
      });
    }

    const privacy = vehicle.ownerId?.privacyPrefs || { publicVehicleProfile: true, displayPhoneNumber: false };

    // STRICT PRIVACY: Return only masked public profile
    const publicProfile = {
      vehicleId: vehicle._id,
      publicDisplayName: vehicle.publicDisplayName,
      isVerified: true,
      ownerName: vehicle.showOwnerName && vehicle.ownerId ? vehicle.ownerId.name : null,
      status: vehicle.status
    };

    if (privacy.publicVehicleProfile !== false) {
      Object.assign(publicProfile, {
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        nickname: vehicle.nickname
      });
    }

    if (privacy.displayPhoneNumber === true && vehicle.ownerId) {
      publicProfile.ownerPhone = vehicle.ownerId.phone;
    }

    return sendSuccess(res, { profile: publicProfile });
  } catch (error) {
    logger.error('Error resolving QR:', error);
    return sendError(res, 'Failed to resolve QR token', 500);
  }
};

// GUEST FACING - No auth
exports.searchVehicle = async (req, res) => {
  try {
    const { number } = req.query;
    if (!number) return sendError(res, 'Registration number is required');

    const normalized = number.replace(/\s+/g, '').toUpperCase();
    const vehicle = await Vehicle.findOne({ registrationNumber: normalized, status: { $ne: 'deleted' } }).populate('ownerId', 'name privacyPrefs');

    if (!vehicle || (vehicle.ownerId?.privacyPrefs && vehicle.ownerId.privacyPrefs.plateSearchable === false)) {
      // Return 404 so we don't leak existence if plateSearchable is false
      return sendError(res, 'Vehicle not found', 404);
    }

    // STRICT PRIVACY: Masked response
    const publicProfile = {
      vehicleId: vehicle._id, // Required to submit a report if we allow searching to report
      publicDisplayName: vehicle.publicDisplayName,
      ownerName: vehicle.showOwnerName && vehicle.ownerId ? vehicle.ownerId.name : null,
      isVerified: true
    };

    return sendSuccess(res, { profile: publicProfile });
  } catch (error) {
    return sendError(res, 'Search failed', 500);
  }
};

exports.regenerateQR = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ _id: id, ownerId: req.user.userId, status: { $ne: 'deleted' } });
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);

    // Revoke old tokens
    await QrToken.updateMany(
      { vehicleId: id, active: true },
      { $set: { active: false, revokedAt: new Date() } }
    );

    // Generate new token
    const tokenStr = generateQRToken(vehicle._id.toString());
    const newQrToken = new QrToken({
      vehicleId: vehicle._id,
      token: tokenStr,
      version: 2 // We could look up max version, but simplified here
    });
    await newQrToken.save();

    return sendSuccess(res, { qrToken: newQrToken.token });
  } catch (error) {
    return sendError(res, 'Failed to regenerate QR', 500);
  }
};
