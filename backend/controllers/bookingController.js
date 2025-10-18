const Booking = require('../models/bookingModel');
const Listing = require('../models/listingModel');

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate, message } = req.body;

    const listing = await Listing.findById(listingId).populate('owner');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if listing is available
    if (!listing.availability.isAvailable) {
      return res.status(400).json({ message: 'Listing is not available' });
    }

    // Check if user is not the owner
    if (listing.owner._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot book your own listing' });
    }

    // Calculate total days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = listing.price * totalDays;

    const booking = await Booking.create({
      listing: listingId,
      renter: req.user.id,
      owner: listing.owner._id,
      startDate,
      endDate,
      totalDays,
      totalAmount,
      message
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title price priceUnit images')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type === 'as-renter') {
      query.renter = req.user.id;
    } else if (type === 'as-owner') {
      query.owner = req.user.id;
    } else {
      query.$or = [
        { renter: req.user.id },
        { owner: req.user.id }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('listing', 'title price priceUnit images location')
      .populate('renter', 'name email phone avatar')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'title price priceUnit images location')
      .populate('renter', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is involved in this booking
    if (booking.renter._id.toString() !== req.user.id && 
        booking.owner._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (approve/reject)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Check if booking is still pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking status cannot be changed' });
    }

    booking.status = status;
    booking.ownerResponse = {
      message: message || '',
      respondedAt: new Date()
    };

    const updatedBooking = await booking.save();
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('listing', 'title price priceUnit images')
      .populate('renter', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is involved in this booking
    if (booking.renter._id.toString() !== req.user.id && 
        booking.owner._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || '';

    const updatedBooking = await booking.save();
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('listing', 'title price priceUnit images')
      .populate('renter', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .populate('listing', 'title price priceUnit images')
      .populate('renter', 'name email phone avatar')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
};
