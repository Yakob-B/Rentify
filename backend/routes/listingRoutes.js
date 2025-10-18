const express = require('express');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  uploadListingImages
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../utils/upload');

const router = express.Router();

router.get('/', getListings);
router.get('/user/my-listings', protect, getUserListings);
router.get('/:id', getListingById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/upload', protect, uploadMultiple, uploadListingImages);

module.exports = router;
