const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { webhook } = require('./controllers/paymentController');
const { handleTelebirrWebhook } = require('./controllers/telebirrController');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://rentify-orcin-five.vercel.app',
      process.env.FRONTEND_URL,
      process.env.VITE_API_BASE_URL?.replace('/api', '') // Remove /api if present
    ].filter(Boolean);
    
    // Check if origin is allowed
    const isExactMatch = allowedOrigins.includes(origin);
    
    // Check if origin is a Vercel deployment (any subdomain of vercel.app)
    const isVercelDeployment = /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);
    
    if (isExactMatch || isVercelDeployment) {
      callback(null, true);
    } else {
      // For development, allow all origins (fallback)
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        // In production, still allow but log it
        console.warn(`CORS: Request from unlisted origin: ${origin}`);
        callback(null, true); // Allow for now, but can be restricted later
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Middleware - CORS must be applied first
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Webhook routes need raw body; handle them before express.json
// Webhooks don't need CORS (they come from external services)
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
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
