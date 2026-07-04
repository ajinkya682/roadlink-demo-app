const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
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
  }]
}, { timestamps: true });

// Pre-save to normalize registrationNumber by removing spaces
vehicleSchema.pre('save', function() {
  if (this.isModified('registrationNumber')) {
    this.registrationNumber = this.registrationNumber.replace(/\s+/g, '');
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
