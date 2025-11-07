const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI || process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Fix admin password
const fixAdminPassword = async () => {
  try {
    await connectDB();

    const adminEmail = process.argv[2] || process.env.FIRST_ADMIN_EMAIL || 'yakobatechno@gmail.com';
    const newPassword = process.argv[3] || process.env.FIRST_ADMIN_PASSWORD || '@Qibat12345';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!admin) {
      console.error(`❌ Admin with email ${adminEmail} not found!`);
      process.exit(1);
    }

    console.log(`Found admin: ${admin.name} (${admin.email})`);
    console.log('Updating password...');

    // Set the new password (plain text - will be hashed by pre-save hook)
    admin.password = newPassword;
    await admin.save();

    console.log('✅ Admin password updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${admin.email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  You can now login with the new password!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
    process.exit(1);
  }
};

// Run the script
fixAdminPassword();

