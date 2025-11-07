const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const dbUri = process.env.DB_URI || process.env.MONGODB_URI;
    if (!dbUri) {
      console.error('❌ Error: DB_URI or MONGODB_URI environment variable is required');
      process.exit(1);
    }
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check admin
const checkAdmin = async () => {
  try {
    await connectDB();

    const email = process.argv[2] || process.env.FIRST_ADMIN_EMAIL || 'yakobatechno@gmail.com';
    const testPassword = process.argv[3];

    console.log('Searching for admin accounts...\n');

    // Find all admins
    const admins = await User.find({ role: 'admin' }).select('name email role isSuspended createdAt');
    
    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database.');
      console.log('\nRun: npm run create-admin');
      process.exit(1);
    }

    console.log(`Found ${admins.length} admin(s):\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Suspended: ${admin.isSuspended ? 'Yes' : 'No'}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log('');
    });

    // Check specific admin if email provided
    const admin = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      role: 'admin' 
    });

    if (!admin) {
      console.log(`\n❌ Admin with email "${email}" not found.`);
      process.exit(1);
    }

    console.log(`\n✅ Found admin: ${admin.name} (${admin.email})`);

    // Test password if provided
    if (testPassword) {
      console.log('\nTesting password...');
      const isValid = await admin.comparePassword(testPassword);
      if (isValid) {
        console.log('✅ Password is CORRECT!');
      } else {
        console.log('❌ Password is INCORRECT!');
        console.log('\nRun: npm run fix-admin-password');
      }
    } else {
      console.log('\n💡 To test password, run:');
      console.log(`   node scripts/check-admin.js ${email} your-password`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
};

// Run the script
checkAdmin();

