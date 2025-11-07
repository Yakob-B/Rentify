const AdminInvitation = require('../models/adminInvitationModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail, emailTemplates } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Create admin invitation
// @route   POST /api/admin/invitations
// @access  Private (Admin only)
const createAdminInvitation = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Check if invitation already exists and is pending
    const existingInvitation = await AdminInvitation.findOne({ 
      email, 
      status: 'pending' 
    });
    if (existingInvitation) {
      return res.status(400).json({ 
        message: 'Admin invitation already sent to this email' 
      });
    }

    // Get inviter details
    const inviter = await User.findById(req.user.id);

    // Create invitation
    const invitation = await AdminInvitation.create({
      email,
      name,
      invitedBy: req.user.id
    });

    // Generate invitation URL
    const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/register/${invitation.token}`;

    // Send invitation email
    try {
      const emailData = emailTemplates.adminInvitation(
        invitation,
        inviter.name || 'Admin',
        invitationUrl
      );
      await sendEmail({
        to: invitation.email,
        subject: emailData.subject,
        html: emailData.html
      });
      console.log(`Admin invitation email sent to: ${invitation.email}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue even if email fails - invitation is still created
    }

    res.status(201).json({
      message: 'Admin invitation sent successfully',
      invitation: {
        id: invitation._id,
        email: invitation.email,
        name: invitation.name,
        expiresAt: invitation.expiresAt,
        token: invitation.token,
        invitationUrl: invitationUrl
      }
    });

  } catch (error) {
    console.error('Create admin invitation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create admin invitation' 
    });
  }
};

// @desc    Get all admin invitations
// @route   GET /api/admin/invitations
// @access  Private (Admin only)
const getAdminInvitations = async (req, res) => {
  try {
    const invitations = await AdminInvitation.find()
      .populate('invitedBy', 'name email')
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    console.error('Get admin invitations error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to get admin invitations' 
    });
  }
};

// @desc    Revoke admin invitation
// @route   DELETE /api/admin/invitations/:id
// @access  Private (Admin only)
const revokeAdminInvitation = async (req, res) => {
  try {
    const invitation = await AdminInvitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot revoke invitation that is not pending' 
      });
    }

    invitation.status = 'revoked';
    await invitation.save();

    res.json({ message: 'Admin invitation revoked successfully' });
  } catch (error) {
    console.error('Revoke admin invitation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to revoke admin invitation' 
    });
  }
};

// @desc    Resend admin invitation
// @route   POST /api/admin/invitations/:id/resend
// @access  Private (Admin only)
const resendAdminInvitation = async (req, res) => {
  try {
    const invitation = await AdminInvitation.findById(req.params.id)
      .populate('invitedBy', 'name email');
    
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Can only resend pending invitations' 
      });
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({ 
        message: 'Invitation has expired. Please create a new invitation.' 
      });
    }

    // Generate invitation URL
    const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/register/${invitation.token}`;

    // Send invitation email
    try {
      const emailData = emailTemplates.adminInvitation(
        invitation,
        invitation.invitedBy?.name || 'Admin',
        invitationUrl
      );
      await sendEmail({
        to: invitation.email,
        subject: emailData.subject,
        html: emailData.html
      });
      console.log(`Admin invitation email resent to: ${invitation.email}`);
    } catch (emailError) {
      console.error('Failed to resend invitation email:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send invitation email. Invitation is still valid.' 
      });
    }

    res.json({ 
      message: 'Admin invitation resent successfully',
      invitationUrl: invitationUrl
    });
  } catch (error) {
    console.error('Resend admin invitation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to resend admin invitation' 
    });
  }
};

// @desc    Register admin with invitation token
// @route   POST /api/auth/register-admin
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, invitationToken, adminSecret } = req.body;

    // Check if any admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    const isFirstAdmin = adminCount === 0;

    // If no admins exist, allow creation with admin secret OR invitation token
    if (isFirstAdmin) {
      // First admin can be created with admin secret from environment
      const requiredSecret = process.env.FIRST_ADMIN_SECRET || 'rentify-first-admin-2024';
      
      if (adminSecret && adminSecret === requiredSecret) {
        // Create first admin with secret key (no invitation needed)
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ 
            message: 'User with this email already exists' 
          });
        }

        // Create first admin user
        const user = await User.create({
          name,
          email,
          password,
          role: 'admin'
        });

        // Generate token
        const token = generateToken(user._id);

        console.log(`First admin created: ${email}`);

        return res.status(201).json({
          message: 'First admin account created successfully',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        });
      } else if (!invitationToken) {
        // No secret provided and no invitation token
        return res.status(400).json({ 
          message: 'Admin secret or invitation token required to create first admin. Please set FIRST_ADMIN_SECRET environment variable or use an invitation token.' 
        });
      }
      // If invitation token is provided, continue with normal flow below
    } else {
      // If admins exist, invitation token is required
      if (!invitationToken) {
        return res.status(400).json({ 
          message: 'Invitation token is required' 
        });
      }
    }

    // Normal admin registration flow (with invitation token)
    // Validate invitation token
    const invitation = await AdminInvitation.findValidByToken(invitationToken);
    if (!invitation) {
      return res.status(400).json({ 
        message: 'Invalid or expired invitation token' 
      });
    }

    // Check if email matches invitation
    if (invitation.email !== email) {
      return res.status(400).json({ 
        message: 'Email does not match invitation' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    // Mark invitation as used
    await invitation.markAsUsed(user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Admin account created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create admin account' 
    });
  }
};

// @desc    Validate invitation token
// @route   GET /api/auth/validate-invitation/:token
// @access  Public
const validateInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const invitation = await AdminInvitation.findValidByToken(token);
    if (!invitation) {
      return res.status(400).json({ 
        message: 'Invalid or expired invitation token' 
      });
    }

    res.json({
      valid: true,
      email: invitation.email,
      name: invitation.name,
      expiresAt: invitation.expiresAt
    });

  } catch (error) {
    console.error('Validate invitation token error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to validate invitation token' 
    });
  }
};

module.exports = {
  createAdminInvitation,
  getAdminInvitations,
  revokeAdminInvitation,
  resendAdminInvitation,
  registerAdmin,
  validateInvitationToken
};
