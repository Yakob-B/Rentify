const express = require('express');
const { createCheckoutSession, webhook } = require('../controllers/paymentController');
const { 
  initiateTelebirrPayment,
  queryTelebirrPaymentStatus,
  handleTelebirrWebhook,
  handleTelebirrReturn,
  refundTelebirrPayment
} = require('../controllers/telebirrController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe routes
router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', webhook);

// Telebirr routes
router.post('/telebirr/initiate', protect, initiateTelebirrPayment);
router.get('/telebirr/status/:bookingId', protect, queryTelebirrPaymentStatus);
router.post('/telebirr/webhook', handleTelebirrWebhook);
router.get('/telebirr/return', handleTelebirrReturn);
router.post('/telebirr/refund', protect, refundTelebirrPayment);

module.exports = router;


