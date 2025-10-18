const Review = require('../models/reviewModel');
const Listing = require('../models/listingModel');

// @desc Get reviews for a listing
// @route GET /api/reviews/listing/:listingId
// @access Public
const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listing: listingId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create or update a review for a listing by current user
// @route POST /api/reviews/listing/:listingId
// @access Private
const upsertReview = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Prevent owner reviewing own listing
    if (listing.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'Owners cannot review their own listings' });
    }

    const review = await Review.findOneAndUpdate(
      { listing: listingId, reviewer: req.user.id },
      { rating, comment: comment || '' },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Recompute listing rating
    const agg = await Review.aggregate([
      { $match: { listing: listing._id } },
      { $group: { _id: '$listing', average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const ratingStats = agg[0] || { average: 0, count: 0 };
    listing.rating = { average: Number(ratingStats.average.toFixed(2)), count: ratingStats.count };
    await listing.save();

    const populated = await Review.findById(review._id).populate('reviewer', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListingReviews,
  upsertReview
};


