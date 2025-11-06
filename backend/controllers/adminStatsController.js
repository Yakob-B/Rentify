const User = require('../models/userModel');
const Listing = require('../models/listingModel');
const Booking = require('../models/bookingModel');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Get booking status counts
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const bookingStatusCounts = bookingStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    // Get listing status counts
    const listingStats = await Listing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const listingStatusCounts = listingStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    // Get user role counts
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const userRoleCounts = userRoleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      pendingBookings: bookingStatusCounts.pending || 0,
      activeBookings: bookingStatusCounts.approved || 0,
      completedBookings: bookingStatusCounts.completed || 0,
      cancelledBookings: bookingStatusCounts.cancelled || 0,
      rejectedBookings: bookingStatusCounts.rejected || 0,
      activeListings: listingStatusCounts.active || 0,
      inactiveListings: listingStatusCounts.inactive || 0,
      suspendedListings: listingStatusCounts.suspended || 0,
      adminUsers: userRoleCounts.admin || 0,
      ownerUsers: userRoleCounts.owner || 0,
      renterUsers: userRoleCounts.renter || 0
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch admin statistics' });
  }
};

module.exports = {
  getAdminStats
};

