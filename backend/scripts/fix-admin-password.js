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

    // Find admin user (case-insensitive)
    const admin = await User.findOne({ 
      email: adminEmail.toLowerCase().trim(), 
      role: 'admin' 
    });
    
    if (!admin) {
      console.error(`❌ Admin with email ${adminEmail} not found!`);
      console.log('\nSearching for all admins...');
      const allAdmins = await User.find({ role: 'admin' }).select('name email');
      if (allAdmins.length > 0) {
        console.log('Found admins:');
        allAdmins.forEach(a => console.log(`  - ${a.name} (${a.email})`));
      } else {
        console.log('No admins found in database.');
      }
      process.exit(1);
    }

    console.log(`✅ Found admin: ${admin.name} (${admin.email})`);
    console.log('\nUpdating password...');

    // Force password update by using updateOne (bypasses pre-save hook issues)
    // We'll manually hash it to ensure it's only hashed once
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update directly in database
    await User.updateOne(
      { _id: admin._id },
      { $set: { password: hashedPassword } }
    );

    // Verify the update worked
    const updatedAdmin = await User.findById(admin._id);
    const testPassword = await updatedAdmin.comparePassword(newPassword);
    
    if (!testPassword) {
      console.error('❌ Password update failed verification!');
      process.exit(1);
    }

    console.log('✅ Admin password updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${updatedAdmin.email}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Role: ${updatedAdmin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the script
fixAdminPassword();

