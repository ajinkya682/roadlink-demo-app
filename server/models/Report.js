const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  category: { type: String, required: true },
  reporterDeviceId: { type: String }, // anonymized fingerprint
  reporterLocation: {
    lat: Number,
    lng: Number
  },
  notes: { type: String },
  mediaUrls: [{ type: String }],
  status: { type: String, default: 'sent', enum: ['sent', 'delivered', 'viewed', 'resolved', 'escalated'] },
  resolvedAt: { type: Date }
}, { timestamps: true });

// Compound index for inbox queries
reportSchema.index({ vehicleId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
