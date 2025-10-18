const Stripe = require('stripe');
const Booking = require('../models/bookingModel');
const Listing = require('../models/listingModel');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc Create Stripe Checkout Session for an approved booking
// @route POST /api/payments/checkout
// @access Private (renter)
const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('listing');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.renter.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (booking.status !== 'approved') return res.status(400).json({ message: 'Booking is not approved' });
    if (booking.paymentStatus === 'paid') return res.status(400).json({ message: 'Booking already paid' });

    const listing = await Listing.findById(booking.listing);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(booking.totalAmount * 100),
            product_data: {
              name: `${listing.title} (${booking.totalDays} days)`,
              images: listing.images?.length ? [listing.images[0]] : undefined
            }
          }
        }
      ],
      customer_email: req.user.email,
      metadata: {
        bookingId: booking._id.toString(),
        renterId: req.user.id
      },
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&booking=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled&booking=${booking._id}`
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Stripe webhook to update booking payment status
// @route POST /api/payments/webhook
// @access Public (Stripe)
const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          booking.paymentStatus = 'paid';
          await booking.save();
        }
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  webhook
};


