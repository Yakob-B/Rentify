const mongoose = require('mongoose');
const crypto = require('crypto');

const adminInvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'expired', 'revoked'],
    default: 'pending'
  },
  usedAt: {
    type: Date
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Generate secure token
adminInvitationSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Check if invitation is valid
adminInvitationSchema.methods.isValid = function() {
  return this.status === 'pending' && this.expiresAt > new Date();
};

// Mark invitation as used
adminInvitationSchema.methods.markAsUsed = function(userId) {
  this.status = 'used';
  this.usedAt = new Date();
  this.usedBy = userId;
  return this.save();
};

// Static method to find valid invitation by token
adminInvitationSchema.statics.findValidByToken = function(token) {
  return this.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() }
  });
};

// Index for performance
adminInvitationSchema.index({ token: 1 });
adminInvitationSchema.index({ email: 1 });
adminInvitationSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('AdminInvitation', adminInvitationSchema);
