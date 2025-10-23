const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  getUserAnalytics
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin user management routes (Admin only)
router.get('/analytics', protect, adminOnly, getUserAnalytics);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.put('/:id/suspend', protect, adminOnly, suspendUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
