const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  channel: { type: String, required: true }, // "push" | "whatsapp" | "sms" | "email"
  status: { type: String, required: true }, // "sent" | "delivered" | "failed"
  providerResponse: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
