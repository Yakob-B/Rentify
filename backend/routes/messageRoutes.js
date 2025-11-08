const express = require('express');
const {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessage,
  markAsRead,
  deleteConversation
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations', protect, getUserConversations);
router.get('/conversations/:id', protect, getConversationById);
router.get('/conversations/:id/messages', protect, getConversationMessages);
router.post('/conversations/:id/messages', protect, sendMessage);
router.put('/conversations/:id/read', protect, markAsRead);
router.delete('/conversations/:id', protect, deleteConversation);

module.exports = router;

