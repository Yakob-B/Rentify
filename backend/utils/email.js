const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  // Supports Gmail, SendGrid, or any SMTP server
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
    },
  });
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Skip email sending if email is not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured. Skipping email send to:', to);
      console.log('Subject:', subject);
      return { success: true, skipped: true };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Rentify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  bookingRequest: (booking, listing, renter, owner) => ({
    subject: `New Booking Request for ${listing.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request</h1>
            </div>
            <div class="content">
              <p>Hello ${owner.name},</p>
              <p>You have received a new booking request for your listing: <strong>${listing.title}</strong></p>
              
              <div class="details">
                <h3>Booking Details:</h3>
                <p><strong>Renter:</strong> ${renter.name} (${renter.email})</p>
                <p><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Total Days:</strong> ${booking.totalDays}</p>
                <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
                ${booking.message ? `<p><strong>Message:</strong> ${booking.message}</p>` : ''}
              </div>
              
              <p>Please log in to your dashboard to approve or reject this booking request.</p>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingApproved: (booking, listing, renter) => ({
    subject: `Booking Approved: ${listing.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Approved! 🎉</h1>
            </div>
            <div class="content">
              <p>Hello ${renter.name},</p>
              <p>Great news! Your booking request for <strong>${listing.title}</strong> has been approved.</p>
              
              <div class="details">
                <h3>Booking Details:</h3>
                <p><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
              </div>
              
              <p>Please complete the payment to confirm your booking.</p>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Complete Payment</a>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingRejected: (booking, listing, renter) => ({
    subject: `Booking Request Update: ${listing.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Request Update</h1>
            </div>
            <div class="content">
              <p>Hello ${renter.name},</p>
              <p>Unfortunately, your booking request for <strong>${listing.title}</strong> has been rejected.</p>
              
              ${booking.ownerResponse?.message ? `
                <div class="details">
                  <p><strong>Owner's Message:</strong></p>
                  <p>${booking.ownerResponse.message}</p>
                </div>
              ` : ''}
              
              <p>You can browse other available listings on our platform.</p>
              <a href="${process.env.FRONTEND_URL}/listings" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Browse Listings</a>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  paymentReceived: (booking, listing, owner) => ({
    subject: `Payment Received for ${listing.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Received! 💰</h1>
            </div>
            <div class="content">
              <p>Hello ${owner.name},</p>
              <p>Payment has been received for the booking of <strong>${listing.title}</strong>.</p>
              
              <div class="details">
                <h3>Payment Details:</h3>
                <p><strong>Amount:</strong> $${booking.totalAmount}</p>
                <p><strong>Booking Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
              </div>
              
              <p>You can view the booking details in your dashboard.</p>
              <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">View Dashboard</a>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingCompleted: (booking, listing, renter, owner) => ({
    subject: `Booking Completed: ${listing.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366F1; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Completed ✅</h1>
            </div>
            <div class="content">
              <p>Hello ${renter.name},</p>
              <p>Your booking for <strong>${listing.title}</strong> has been marked as completed.</p>
              
              <div class="details">
                <h3>Booking Summary:</h3>
                <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
              </div>
              
              <p>We hope you had a great experience! Please consider leaving a review.</p>
              <a href="${process.env.FRONTEND_URL}/listings/${listing._id}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Leave a Review</a>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (user, resetUrl) => ({
    subject: 'Reset Your Password - Rentify',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .token-box { background: #E5E7EB; padding: 15px; border-radius: 5px; margin: 15px 0; word-break: break-all; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>We received a request to reset your password for your Rentify account.</p>
              
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="token-box">${resetUrl}</div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password will not change until you click the link and create a new one</li>
                </ul>
              </div>
              
              <p>For security reasons, if you didn't request this password reset, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The Rentify Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
};

