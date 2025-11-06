const express = require('express');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  getNearbyListings,
  uploadListingImages
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../utils/upload');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

const router = express.Router();

// Cache public endpoints for 5 minutes
router.get('/', cacheMiddleware(300), getListings);
router.get('/nearby', cacheMiddleware(300), getNearbyListings);
router.get('/:id', cacheMiddleware(600), getListingById); // Cache individual listings for 10 minutes

// Protected routes (no caching)
router.get('/user/my-listings', protect, getUserListings);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/upload', protect, uploadMultiple, uploadListingImages);

module.exports = router;
