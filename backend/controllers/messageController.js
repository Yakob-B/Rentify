const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Listing = require('../models/listingModel');

// @desc    Get or create conversation between users (optionally for a listing)
// @route   POST /api/messages/conversations
// @access  Private
const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId, listingId } = req.body;
    const userId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === userId) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Check if listing exists (if provided)
    if (listingId) {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
    }

    // Find or create conversation
    const participants = [userId, recipientId].sort();
    const query = listingId 
      ? { participants: { $all: participants }, listing: listingId }
      : { participants: { $all: participants }, listing: null };

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name email avatar')
      .populate('listing', 'title images')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: participants,
        listing: listingId || null
      });
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar')
        .populate('listing', 'title images');
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get or create conversation error:', error);
    res.status(500).json({ message: error.message || 'Failed to get or create conversation' });
  }
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name email avatar')
      .populate('listing', 'title images')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    // Get unread counts for current user
    const conversationsWithUnread = conversations.map(conv => {
      const unreadCount = conv.unreadCount?.get(userId) || 0;
      return {
        ...conv.toObject(),
        unreadCount
      };
    });

    res.json(conversationsWithUnread);
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({ message: error.message || 'Failed to get conversations' });
  }
};

// @desc    Get conversation by ID
// @route   GET /api/messages/conversations/:id
// @access  Private
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email avatar')
      .populate('listing', 'title images price priceUnit')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p._id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: error.message || 'Failed to get conversation' });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:id/messages
// @access  Private
const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    // Get messages
    const messages = await Message.find({ conversation: id })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversation: id });

    // Mark messages as read
    await Message.updateMany(
      { conversation: id, sender: { $ne: userId }, read: false },
      { read: true, readAt: new Date() }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message || 'Failed to get messages' });
  }
};

// @desc    Send a message
// @route   POST /api/messages/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send message' });
    }

    // Create message
    const message = await Message.create({
      conversation: id,
      sender: userId,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participants
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== userId) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message || 'Failed to send message' });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/conversations/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Mark all messages as read
    await Message.updateMany(
      { conversation: id, sender: { $ne: userId }, read: false },
      { read: true, readAt: new Date() }
    );

    // Reset unread count
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: error.message || 'Failed to mark messages as read' });
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessage,
  markAsRead
};

