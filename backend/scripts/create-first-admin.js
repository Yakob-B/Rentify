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

// Create first admin
const createFirstAdmin = async () => {
  try {
    await connectDB();

    // Check if any admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      console.log('Admin already exists here. Exiting...');
      process.exit(0);
    }

    // Get admin details from environment or use defaults
    const adminName = process.env.FIRST_ADMIN_NAME || 'Yakob';
    const adminEmail = process.env.FIRST_ADMIN_EMAIL || 'yakobatechno@gmail.com';
    const adminPassword = process.env.FIRST_ADMIN_PASSWORD || '@Qibat12345';

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log(`User with email ${adminEmail} already exists.`);
      if (existingUser.role === 'admin') {
        console.log('This user is already an admin.');
      } else {
        console.log('Updating user role to admin...');
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('User role updated to admin successfully!');
      }
      process.exit(0);
    }

    // Create admin user - password will be automatically hashed by User model pre-save hook
    // DO NOT hash the password manually - User.create() will handle it
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Pass plain password, model will hash it
      role: 'admin'
    });

    console.log('✅ First admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword} (please change this after first login)`);
    console.log(`Role: ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating first admin:', error);
    process.exit(1);
  }
};

// Run the script
createFirstAdmin();

