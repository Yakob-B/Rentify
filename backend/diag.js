const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Listing = require('./models/listingModel');

async function run() {
    try {
        if (!process.env.DB_URI) {
            console.log("No DB_URI found in .env");
            process.exit(1);
        }
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to DB');

        const total = await Listing.countDocuments();
        const active = await Listing.countDocuments({ status: 'active' });
        const withGeo = await Listing.countDocuments({ geo: { $exists: true } });

        console.log(`Total: ${total}`);
        console.log(`Active: ${active}`);
        console.log(`With Geo: ${withGeo}`);

        if (total > 0) {
            const sample = await Listing.findOne({ geo: { $exists: true } });
            if (sample) {
                console.log('Sample Geo:', JSON.stringify(sample.geo, null, 2));
            } else {
                console.log('No listings with geo field found.');
                const anySample = await Listing.findOne();
                if (anySample) {
                    console.log('Sample Listing (no geo):', JSON.stringify({
                        title: anySample.title,
                        location: anySample.location,
                        geo: anySample.geo
                    }, null, 2));
                }
            }
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
