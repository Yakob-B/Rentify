const express = require('express');
const { getListingReviews, upsertReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listing/:listingId', getListingReviews);
router.post('/listing/:listingId', protect, upsertReview);

module.exports = router;


