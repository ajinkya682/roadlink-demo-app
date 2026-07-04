const Vehicle = require('../../models/Vehicle');
const QrToken = require('../../models/QrToken');
const { sendSuccess, sendError } = require('../../utils/response');
const { generateQRToken } = require('../../utils/hmac');
const { logger } = require('../../middleware/logger');
const { uploadBuffer } = require('../../services/cloudinary');

exports.createVehicle = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { registrationNumber, make, model, nickname, publicDisplayName, showOwnerName } = req.body;

    if (!registrationNumber) {
      return sendError(res, 'Registration number is required');
    }

    const vehicle = new Vehicle({
      ownerId: userId,
      registrationNumber,
      make,
      model,
      nickname,
      publicDisplayName: publicDisplayName || nickname || make || 'Vehicle',
      showOwnerName: !!showOwnerName
    });

    if (req.file) {
      try {
        const result = await uploadBuffer(req.file.buffer, 'roadlink/vehicles', 'image');
        vehicle.imageUrl = result.secure_url;
      } catch (uploadError) {
        logger.error('Failed to upload vehicle image', uploadError);
      }
    }

    await vehicle.save();

    // Generate QR token immediately
    const tokenStr = generateQRToken(vehicle._id.toString());
    const qrToken = new QrToken({
      vehicleId: vehicle._id,
      token: tokenStr
    });
    await qrToken.save();

    return sendSuccess(res, {
      vehicle,
      qrToken: qrToken.token
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
    const vehicles = await Vehicle.find({ ownerId: userId, status: { $ne: 'deleted' } });
    return sendSuccess(res, { vehicles });
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
    
    return sendSuccess(res, { vehicle, qrToken: qrToken ? qrToken.token : null });
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

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, ownerId: req.user.userId, status: { $ne: 'deleted' } },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!vehicle) return sendError(res, 'Vehicle not found', 404);
    return sendSuccess(res, { vehicle });
  } catch (error) {
    return sendError(res, 'Failed to update vehicle', 500);
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, ownerId: req.user.userId },
      { $set: { status: 'deleted' } },
      { new: true }
    );
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);
    
    // Invalidate QR tokens
    await QrToken.updateMany({ vehicleId: id, active: true }, { $set: { active: false, revokedAt: new Date() } });

    return sendSuccess(res, { message: 'Vehicle deleted successfully' });
  } catch (error) {
    return sendError(res, 'Failed to delete vehicle', 500);
  }
};

// GUEST FACING - No auth
exports.resolveQR = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return sendError(res, 'Token is required');

    const qrToken = await QrToken.findOne({ token, active: true });
    if (!qrToken) return sendError(res, 'Invalid or inactive QR token', 404);

    const vehicleId = qrToken.vehicleId;

    const vehicle = await Vehicle.findById(vehicleId).populate('ownerId', 'name');
    if (!vehicle || vehicle.status === 'deleted') {
      return sendError(res, 'Vehicle not found', 404);
    }

    // STRICT PRIVACY: Return only masked public profile
    const publicProfile = {
      vehicleId: vehicle._id,
      publicDisplayName: vehicle.publicDisplayName,
      isVerified: true,
      ownerName: vehicle.showOwnerName && vehicle.ownerId ? vehicle.ownerId.name : null,
      status: vehicle.status
    };

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
    const vehicle = await Vehicle.findOne({ registrationNumber: normalized, status: { $ne: 'deleted' } }).populate('ownerId', 'name');

    if (!vehicle) {
      // Return 200 with null data so we don't leak existence easily, or 404.
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
