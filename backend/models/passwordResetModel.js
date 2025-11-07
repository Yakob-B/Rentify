const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema({
  user: {
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
    default: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  },
  used: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate secure token
passwordResetSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Check if token is valid (not expired and not used)
passwordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

// Index for faster queries
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ user: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

module.exports = mongoose.model('PasswordReset', passwordResetSchema);

