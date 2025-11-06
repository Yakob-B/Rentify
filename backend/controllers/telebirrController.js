const TelebirrService = require('../utils/telebirr');
const Booking = require('../models/bookingModel');
const Listing = require('../models/listingModel');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Initiate Telebirr payment for booking
// @route   POST /api/payments/telebirr/initiate
// @access  Private (renter)
const initiateTelebirrPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Validate booking exists and user is authorized
    const booking = await Booking.findById(bookingId)
      .populate('listing', 'title price priceUnit images')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.renter._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    // Check booking status
    if (booking.status !== 'approved') {
      return res.status(400).json({ 
        message: 'Booking must be approved before payment' 
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ 
        message: 'Booking is already paid' 
      });
    }

    // Validate Telebirr configuration
    try {
      TelebirrService.validateConfig();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Payment service configuration error' 
      });
    }

    // Prepare payment data
    const paymentData = {
      outTradeNo: `RENTIFY_${booking._id}_${Date.now()}`,
      totalAmount: TelebirrService.formatAmount(booking.totalAmount),
      subject: `Rentify Booking - ${booking.listing.title}`,
      receiveName: 'Rentify Platform',
      timeoutExpress: '30'
    };

    // Initiate payment with Telebirr
    const paymentResult = await TelebirrService.initiatePayment(paymentData);

    if (paymentResult.success) {
      // Update booking with payment details
      booking.paymentMethod = 'telebirr';
      booking.paymentDetails = {
        ...booking.paymentDetails,
        transactionId: paymentResult.transactionId,
        paymentProvider: 'telebirr',
        paymentUrl: paymentResult.paymentUrl,
        qrCode: paymentResult.qrCode
      };
      
      await booking.save();

      res.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        transactionId: paymentResult.transactionId,
        qrCode: paymentResult.qrCode,
        bookingId: booking._id,
        amount: booking.totalAmount,
        message: 'Payment initiated successfully'
      });
    } else {
      throw new Error('Payment initiation failed');
    }

  } catch (error) {
    console.error('Telebirr payment initiation error:', error);
    res.status(500).json({ 
      message: error.message || 'Payment initiation failed' 
    });
  }
};

// @desc    Query Telebirr payment status
// @route   GET /api/payments/telebirr/status/:bookingId
// @access  Private
const queryTelebirrPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.renter._id.toString() !== req.user.id && 
        booking.owner._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!booking.paymentDetails.transactionId) {
      return res.status(400).json({ message: 'No payment transaction found' });
    }

    // Query payment status from Telebirr
    const statusResult = await TelebirrService.queryPaymentStatus(
      booking.paymentDetails.transactionId
    );

    if (statusResult.success) {
      // Update booking status if payment is completed
      if (statusResult.status === 'SUCCESS' && booking.paymentStatus !== 'paid') {
        booking.paymentStatus = 'paid';
        booking.paymentDetails.paidAt = new Date(statusResult.paidAt);
        await booking.save();
      }

      res.json({
        success: true,
        paymentStatus: booking.paymentStatus,
        providerStatus: statusResult.status,
        transactionId: statusResult.transactionId,
        amount: statusResult.amount,
        paidAt: statusResult.paidAt
      });
    } else {
      throw new Error('Payment status query failed');
    }

  } catch (error) {
    console.error('Telebirr payment status query error:', error);
    res.status(500).json({ 
      message: error.message || 'Payment status query failed' 
    });
  }
};

// @desc    Handle Telebirr payment notification webhook
// @route   POST /api/payments/telebirr/webhook
// @access  Public (Telebirr)
const handleTelebirrWebhook = async (req, res) => {
  try {
    console.log('Telebirr webhook received:', req.body);

    // Process notification from Telebirr
    const notification = TelebirrService.processNotification(req.body);

    if (notification.success) {
      // Find booking by transaction ID
      const booking = await Booking.findOne({
        'paymentDetails.transactionId': notification.outTradeNo
      }).populate('renter owner listing');

      if (booking) {
        // Update booking based on payment status
        if (notification.status === 'SUCCESS') {
          booking.paymentStatus = 'paid';
          booking.paymentDetails.paidAt = new Date(notification.paidAt);
          booking.paymentDetails.providerTransactionId = notification.transactionId;
          
          // Send email notification to owner
          try {
            const emailData = emailTemplates.paymentReceived(
              booking,
              booking.listing,
              booking.owner
            );
            await sendEmail({
              to: booking.owner.email,
              ...emailData,
            });
          } catch (emailError) {
            console.error('Failed to send payment received email:', emailError);
          }
          
          console.log(`Payment successful for booking ${booking._id}`);
        } else if (notification.status === 'FAILED') {
          booking.paymentStatus = 'failed';
          console.log(`Payment failed for booking ${booking._id}`);
        }

        await booking.save();

        res.status(200).json({ 
          success: true, 
          message: 'Webhook processed successfully' 
        });
      } else {
        console.error('Booking not found for transaction:', notification.outTradeNo);
        res.status(404).json({ message: 'Booking not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid notification' });
    }

  } catch (error) {
    console.error('Telebirr webhook processing error:', error);
    res.status(500).json({ 
      message: error.message || 'Webhook processing failed' 
    });
  }
};

// @desc    Handle Telebirr payment return (user redirected back)
// @route   GET /api/payments/telebirr/return
// @access  Public
const handleTelebirrReturn = async (req, res) => {
  try {
    const { outTradeNo, status, message } = req.query;

    if (!outTradeNo) {
      return res.status(400).json({ message: 'Missing transaction ID' });
    }

    // Find booking
    const booking = await Booking.findOne({
      'paymentDetails.transactionId': outTradeNo
    }).populate('listing renter owner');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status based on return parameters
    if (status === 'SUCCESS') {
      booking.paymentStatus = 'paid';
      booking.paymentDetails.paidAt = new Date();
    } else {
      booking.paymentStatus = 'failed';
    }

    await booking.save();

    // Redirect to frontend with status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/dashboard?payment=${status.toLowerCase()}&booking=${booking._id}`;
    
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Telebirr return handling error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?payment=error`);
  }
};

// @desc    Refund Telebirr payment
// @route   POST /api/payments/telebirr/refund
// @access  Private (admin/owner)
const refundTelebirrPayment = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization (admin or owner)
    if (req.user.role !== 'admin' && 
        booking.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to refund' });
    }

    // Check if payment can be refunded
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ 
        message: 'Only paid bookings can be refunded' 
      });
    }

    // Note: Telebirr refund implementation would depend on their API
    // For now, we'll just mark it as refunded in our system
    booking.paymentStatus = 'refunded';
    booking.paymentDetails.refundedAt = new Date();
    booking.paymentDetails.refundReason = reason || 'Refund requested';

    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      bookingId: booking._id,
      refundedAt: booking.paymentDetails.refundedAt
    });

  } catch (error) {
    console.error('Telebirr refund error:', error);
    res.status(500).json({ 
      message: error.message || 'Refund processing failed' 
    });
  }
};

module.exports = {
  initiateTelebirrPayment,
  queryTelebirrPaymentStatus,
  handleTelebirrWebhook,
  handleTelebirrReturn,
  refundTelebirrPayment
};
