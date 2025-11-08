/*
  Script to fix listings with invalid geo fields (geo.type: null)
  Usage: DB_URI=mongodb+srv://... node scripts/fix-invalid-geo.js
*/

const mongoose = require('mongoose')
const path = require('path')

// Ensure models can be required relative to this script
const Listing = require(path.join('..', 'models', 'listingModel'))

async function run() {
  const { DB_URI } = process.env
  if (!DB_URI) {
    console.error('Missing DB_URI environment variable')
    process.exit(1)
  }

  try {
    await mongoose.connect(DB_URI)
    console.log('Connected to MongoDB')
    console.log('Fixing listings with invalid geo fields...\n')

    // Find all listings with invalid geo fields
    const listings = await Listing.find({
      $or: [
        { 'geo.type': null },
        { 'geo': { $exists: true, $ne: null }, 'geo.coordinates': { $exists: false } },
        { 'geo': { $exists: true, $ne: null }, 'geo.coordinates': { $exists: true, $not: { $size: 2 } } }
      ]
    })

    console.log(`Found ${listings.length} listings with invalid geo fields\n`)

    let fixed = 0
    let removed = 0
    let skipped = 0

    for (const listing of listings) {
      try {
        // Try to fix from location.coordinates
        if (listing.location && listing.location.coordinates) {
          const { lat, lng } = listing.location.coordinates
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
            )
            console.log(`✅ Fixed listing: ${listing.title} (${listing._id}) - populated from location`)
            fixed++
            continue
          }
        }

        // Remove invalid geo field
        await Listing.updateOne(
          { _id: listing._id },
          { $unset: { geo: '' } }
        )
        console.log(`🗑️  Removed invalid geo from listing: ${listing.title} (${listing._id})`)
        removed++
      } catch (err) {
        console.error(`❌ Error processing listing ${listing._id}:`, err.message)
        skipped++
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`Fix complete!`)
    console.log(`  Fixed: ${fixed}`)
    console.log(`  Removed: ${removed}`)
    console.log(`  Skipped: ${skipped}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Fix failed:', err)
    process.exit(1)
  }
}

run()

