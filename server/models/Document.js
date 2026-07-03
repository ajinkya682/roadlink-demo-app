const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['RC Book', 'Insurance', 'PUC', 'Driving License'] }, // MVP fixed set
  fileUrl: { type: String, required: true }, // local path for MVP, would be encrypted storage ref
  expiryDate: { type: Date },
  reminderSchedule: [{ type: Number }] // e.g. [30,15,7,1] days before expiry
}, { timestamps: true });

documentSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Document', documentSchema);
