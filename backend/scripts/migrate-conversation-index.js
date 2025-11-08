/*
  Script to migrate conversation indexes - removes unique constraint
  This allows multiple conversations per listing
  
  Usage: DB_URI=mongodb+srv://... node scripts/migrate-conversation-index.js
*/

const mongoose = require('mongoose')
const path = require('path')

// Ensure models can be required relative to this script
const Conversation = require(path.join('..', 'models', 'conversationModel'))

async function run() {
  const { DB_URI } = process.env
  if (!DB_URI) {
    console.error('Missing DB_URI environment variable')
    process.exit(1)
  }

  try {
    await mongoose.connect(DB_URI)
    console.log('Connected to MongoDB')
    console.log('Migrating conversation indexes...\n')

    const db = mongoose.connection.db
    const collection = db.collection('conversations')

    // List existing indexes
    const indexes = await collection.indexes()
    console.log('Current indexes:')
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })

    // Drop the old unique index if it exists
    try {
      await collection.dropIndex('participants_1_listing_1')
      console.log('\n✅ Dropped unique index: participants_1_listing_1')
    } catch (err) {
      if (err.code === 27 || err.codeName === 'IndexNotFound') {
        console.log('\n⚠️  Unique index not found (may have been already dropped)')
      } else {
        throw err
      }
    }

    // The new non-unique indexes will be created automatically by Mongoose
    // when the model is loaded, so we don't need to create them manually
    
    console.log('\n✅ Migration complete!')
    console.log('The conversation model now allows multiple conversations per listing.')

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  }
}

run()

