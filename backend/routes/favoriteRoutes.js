const express = require('express');
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
  checkMultipleFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addFavorite);
router.get('/', protect, getUserFavorites);
router.get('/check/:listingId', protect, checkFavorite);
router.post('/check-multiple', protect, checkMultipleFavorites);
router.delete('/:listingId', protect, removeFavorite);

module.exports = router;

