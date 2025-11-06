const NodeCache = require('node-cache');

// Create cache instance with 5 minute default TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const key = `${req.originalUrl || req.url}`;
    
    // Check if cached response exists
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      // Set cache headers
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data) {
      // Cache the response
      cache.set(key, data, ttl);
      // Set cache headers
      res.set('X-Cache', 'MISS');
      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for a specific key pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const clearCache = (pattern) => {
  const keys = cache.keys();
  const regex = new RegExp(pattern);
  keys.forEach(key => {
    if (regex.test(key)) {
      cache.del(key);
    }
  });
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  cache.flushAll();
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  cache
};

