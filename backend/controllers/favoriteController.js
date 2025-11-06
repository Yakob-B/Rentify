const Favorite = require('../models/favoriteModel');
const Listing = require('../models/listingModel');

// @desc    Add listing to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, listing: listingId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Listing already in favorites' });
    }

    const favorite = await Favorite.create({
      user: userId,
      listing: listingId
    });

    const populatedFavorite = await Favorite.findById(favorite._id)
      .populate('listing', 'title price priceUnit images location rating');

    res.status(201).json(populatedFavorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: error.message || 'Failed to add favorite' });
  }
};

// @desc    Remove listing from favorites
// @route   DELETE /api/favorites/:listingId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      listing: listingId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: error.message || 'Failed to remove favorite' });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const favorites = await Favorite.find({ user: userId })
      .populate('listing', 'title description price priceUnit images location rating category owner')
      .populate('listing.category', 'name icon')
      .populate('listing.owner', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments({ user: userId });

    res.json({
      favorites: favorites.map(fav => fav.listing),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: error.message || 'Failed to get favorites' });
  }
};

// @desc    Check if listing is favorited
// @route   GET /api/favorites/check/:listingId
// @access  Private
const checkFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      user: userId,
      listing: listingId
    });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: error.message || 'Failed to check favorite' });
  }
};

// @desc    Get favorite status for multiple listings
// @route   POST /api/favorites/check-multiple
// @access  Private
const checkMultipleFavorites = async (req, res) => {
  try {
    const { listingIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(listingIds)) {
      return res.status(400).json({ message: 'listingIds must be an array' });
    }

    const favorites = await Favorite.find({
      user: userId,
      listing: { $in: listingIds }
    });

    const favoritedIds = favorites.map(fav => fav.listing.toString());
    const statusMap = {};
    listingIds.forEach(id => {
      statusMap[id] = favoritedIds.includes(id.toString());
    });

    res.json(statusMap);
  } catch (error) {
    console.error('Check multiple favorites error:', error);
    res.status(500).json({ message: error.message || 'Failed to check favorites' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
  checkMultipleFavorites
};

