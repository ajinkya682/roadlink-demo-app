const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['two-wheeler', 'four-wheeler', 'commercial'], default: 'four-wheeler' },
  make: { type: String },
  model: { type: String },
  year: { type: String },
  color: { type: String },
  nickname: { type: String },
  publicDisplayName: { type: String },
  imageUrl: { type: String },
  showOwnerName: { type: Boolean, default: false },
  status: { type: String, default: 'active', enum: ['active', 'stolen', 'transferred', 'deleted'] },
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    permissions: [String]
  }],
  // Subscription & Protection Model
  protectionStatus: { type: String, enum: ['pending_payment', 'active', 'grace_period', 'lapsed'], default: 'pending_payment' },
  razorpaySubscriptionId: { type: String },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  gracePeriodEndsAt: { type: Date },
  hasUsedFreeStickerOrder: { type: Boolean, default: false },
  refundGuaranteeExpiresAt: { type: Date }
}, { timestamps: true });

// Pre-save to normalize registrationNumber by removing spaces
vehicleSchema.pre('save', function() {
  if (this.isModified('registrationNumber')) {
    this.registrationNumber = this.registrationNumber.replace(/\s+/g, '');
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
