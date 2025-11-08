const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: false // Optional - can be a general conversation
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for finding user conversations (participants array is multikey)
// Removed unique constraint to allow multiple conversations per listing
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

// Index for finding conversations by listing (not unique - allows multiple conversations per listing)
conversationSchema.index({ listing: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);

