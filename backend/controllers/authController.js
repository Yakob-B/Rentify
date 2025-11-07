const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'renter'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ 
        message: 'Account is suspended', 
        reason: user.suspensionReason || 'Contact administrator for more information' 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Login successful
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.avatar = req.body.avatar || user.avatar;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      const PasswordReset = require('../models/passwordResetModel');
      const { sendEmail, emailTemplates } = require('../utils/email');

      // Invalidate any existing reset tokens for this user
      await PasswordReset.updateMany(
        { user: user._id, used: false },
        { used: true }
      );

      // Create new password reset token
      const passwordReset = await PasswordReset.create({
        user: user._id
      });

      // Generate reset URL
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${passwordReset.token}`;

      // Send password reset email
      const emailData = emailTemplates.passwordReset(user, resetUrl);
      await sendEmail({
        to: user.email,
        subject: emailData.subject,
        html: emailData.html
      });

      console.log(`Password reset email sent to: ${user.email}`);
    }

    // Always return success message to prevent email enumeration
    res.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Still return success to prevent email enumeration
    res.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const PasswordReset = require('../models/passwordResetModel');

    // Find reset token
    const passwordReset = await PasswordReset.findOne({ token }).populate('user');

    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if token is valid (not used and not expired)
    if (!passwordReset.isValid()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Check if user still exists
    if (!passwordReset.user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update user password
    const user = passwordReset.user;
    user.password = password; // Will be hashed by pre-save hook
    await user.save();

    // Mark token as used
    passwordReset.used = true;
    passwordReset.usedAt = new Date();
    await passwordReset.save();

    console.log(`Password reset successful for user: ${user.email}`);

    res.json({
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
};
