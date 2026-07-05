const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  priority: { type: Number, default: 2 }, // 1 = primary
  relation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
