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

// Ensure unique conversation between two users for a listing
// Using sparse index - only enforces uniqueness when listing exists
// Note: MongoDB multikey indexes on arrays work, but we must ensure array order is consistent
conversationSchema.index({ participants: 1, listing: 1 }, { 
  unique: true, 
  sparse: true
});

// Index for finding user conversations (participants array is multikey)
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);

