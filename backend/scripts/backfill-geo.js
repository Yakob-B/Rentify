/*
  One-time script to backfill Listing.geo from existing location.coordinates
  Usage: DB_URI=mongodb+srv://... node scripts/backfill-geo.js
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

    const cursor = Listing.find({}).cursor()
    let updated = 0
    let skipped = 0

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const hasGeo = doc.geo && Array.isArray(doc.geo.coordinates) && doc.geo.coordinates.length === 2
      const hasLegacy = doc.location && doc.location.coordinates && typeof doc.location.coordinates.lat === 'number' && typeof doc.location.coordinates.lng === 'number'
      
      // Check if geo field exists but is incomplete (has type but no coordinates)
      const hasIncompleteGeo = doc.geo && doc.geo.type === 'Point' && (!doc.geo.coordinates || !Array.isArray(doc.geo.coordinates) || doc.geo.coordinates.length !== 2)

      if (hasGeo) {
        skipped++
        continue
      }

      if (hasLegacy) {
        const { lat, lng } = doc.location.coordinates
        doc.geo = {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
          address: doc.location && doc.location.address ? doc.location.address : undefined
        }
        await doc.save()
        updated++
        console.log(`✅ Updated listing: ${doc.title} (${doc._id})`)
      } else if (hasIncompleteGeo) {
        // If geo is incomplete and no legacy coordinates, set to null to remove invalid geo
        // This prevents the "Can't extract geo keys" error
        console.log(`⚠️  Listing ${doc._id} has incomplete geo field. Setting to null.`)
        doc.geo = null
        await doc.save()
        updated++
      } else {
        skipped++
      }
    }

    console.log(`Backfill complete. Updated: ${updated}, Skipped: ${skipped}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Backfill failed:', err)
    process.exit(1)
  }
}

run()


