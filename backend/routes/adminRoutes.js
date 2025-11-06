const express = require('express');
const {
  createAdminInvitation,
  getAdminInvitations,
  revokeAdminInvitation,
  registerAdmin,
  validateInvitationToken
} = require('../controllers/adminInvitationController');
const { getAdminStats } = require('../controllers/adminStatsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin stats route (Admin only)
router.get('/stats', protect, adminOnly, getAdminStats);

// Admin invitation management routes (Admin only)
router.post('/invitations', protect, adminOnly, createAdminInvitation);
router.get('/invitations', protect, adminOnly, getAdminInvitations);
router.delete('/invitations/:id', protect, adminOnly, revokeAdminInvitation);

// Public admin registration routes
router.post('/register-admin', registerAdmin);
router.get('/validate-invitation/:token', validateInvitationToken);

module.exports = router;
