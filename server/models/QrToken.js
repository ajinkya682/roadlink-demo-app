const mongoose = require('mongoose');

const qrTokenSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  token: { type: String, required: true, unique: true },
  version: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  revokedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('QrToken', qrTokenSchema);
