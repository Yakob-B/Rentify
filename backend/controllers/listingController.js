const Listing = require('../models/listingModel');
const Category = require('../models/categoryModel');
const { getPublicIdFromUrl } = require('../utils/upload');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const {
      category,
      location,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'active' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search on title/description
    if (search) {
      // Prefer text search if index exists
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let listingsQuery = Listing.find(query)
      .populate('category', 'name icon')
      .populate('owner', 'name email phone avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // If using text search, project score and sort by it if no custom sort provided
    if (search) {
      listingsQuery = Listing.find(query, { score: { $meta: 'textScore' } })
        .populate('category', 'name icon')
        .populate('owner', 'name email phone avatar')
        .sort(sortBy === 'createdAt' ? { score: { $meta: 'textScore' } } : sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    const listings = await listingsQuery;
    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('category', 'name icon')
      .populate('owner', 'name email phone avatar');

    if (listing) {
      // Increment view count
      listing.views += 1;
      await listing.save();
      
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      owner: req.user.id
    };

    const listing = await Listing.create(listingData);
    const populatedListing = await Listing.findById(listing._id)
      .populate('category', 'name icon')
      .populate('owner', 'name email phone avatar');

    res.status(201).json(populatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('category', 'name icon').populate('owner', 'name email phone avatar');

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is owner or admin
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's listings
// @route   GET /api/listings/user/my-listings
// @access  Private
const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  // Upload images controller expects multer to populate req.files
  uploadListingImages: async (req, res) => {
    try {
      const files = req.files || [];
      const images = files.map((file) => ({
        url: file.path,
        publicId: getPublicIdFromUrl(file.path)
      }));

      res.status(201).json({ images });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
