const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const { webhook } = require('./controllers/paymentController');
const { handleTelebirrWebhook } = require('./controllers/telebirrController');

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://rentify-orcin-five.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.warn(`CORS: Request from unlisted origin: ${origin}`);
        callback(null, true); // Still allowing but could be restricted
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
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

// Content compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 to accommodate dashboard use
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all routes except webhooks
app.use('/api/', (req, res, next) => {
  if (req.path === '/payments/webhook' || req.path === '/payments/telebirr/webhook') {
    return next();
  }
  limiter(req, res, next);
});

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
