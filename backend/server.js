const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { webhook } = require('./controllers/paymentController');

// Middleware
app.use(cors());
// Stripe webhook needs raw body; handle it before express.json and before other routes
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhook);
// For all other routes use JSON parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
