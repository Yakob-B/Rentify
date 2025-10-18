const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.post('/', protect, createBooking);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
