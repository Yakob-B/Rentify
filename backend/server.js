const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { webhook } = require('./controllers/paymentController');
const { handleTelebirrWebhook } = require('./controllers/telebirrController');

// Middleware
app.use(cors());

// Webhook routes need raw body; handle them before express.json
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhook);
app.post('/api/payments/telebirr/webhook', express.raw({ type: 'application/json' }), handleTelebirrWebhook);

// For all other routes use JSON parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/users', require('./routes/userRoutes'));
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
