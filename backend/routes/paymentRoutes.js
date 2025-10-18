const express = require('express');
const { createCheckoutSession, webhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout', protect, createCheckoutSession);
// Webhook requires raw body; mounting will handle middleware
router.post('/webhook', webhook);

module.exports = router;


