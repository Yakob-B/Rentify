const mongoose = require('mongoose');
const Listing = require('../models/listingModel');

// @desc    Fix invalid geo fields in listings
// @route   POST /api/admin/fix-geo
// @access  Private (Admin only)
const fixInvalidGeo = async (req, res) => {
  try {
    console.log('Starting geo fix process...');

    // Find all listings with invalid geo fields
    const listings = await Listing.find({
      $or: [
        { 'geo.type': null },
        { 'geo': { $exists: true, $ne: null }, 'geo.coordinates': { $exists: false } },
        { 'geo': { $exists: true, $ne: null }, 'geo.coordinates': { $exists: true, $not: { $size: 2 } } }
      ]
    });

    console.log(`Found ${listings.length} listings with invalid geo fields`);

    let fixed = 0;
    let removed = 0;
    let skipped = 0;
    const errors = [];

    for (const listing of listings) {
      try {
        // Try to fix from location.coordinates
        if (listing.location && listing.location.coordinates) {
          const { lat, lng } = listing.location.coordinates;
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            // Fix geo from location
            await Listing.updateOne(
              { _id: listing._id },
              {
                $set: {
                  geo: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)],
                    address: listing.location.address || listing.geo?.address
                  }
                }
              }
            );
            console.log(`✅ Fixed listing: ${listing.title} (${listing._id}) - populated from location`);
            fixed++;
            continue;
          }
        }

        // Remove invalid geo field
        await Listing.updateOne(
          { _id: listing._id },
          { $unset: { geo: '' } }
        );
        console.log(`🗑️  Removed invalid geo from listing: ${listing.title} (${listing._id})`);
        removed++;
      } catch (err) {
        console.error(`❌ Error processing listing ${listing._id}:`, err.message);
        errors.push({ listingId: listing._id, error: err.message });
        skipped++;
      }
    }

    const result = {
      success: true,
      message: 'Geo fix process completed',
      stats: {
        total: listings.length,
        fixed: fixed,
        removed: removed,
        skipped: skipped
      }
    };

    if (errors.length > 0) {
      result.errors = errors;
    }

    console.log('Geo fix process completed:', result);
    res.json(result);
  } catch (error) {
    console.error('Geo fix process failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix geo fields',
      error: error.message
    });
  }
};

module.exports = {
  fixInvalidGeo
};

