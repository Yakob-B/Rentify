const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    enhanceListingDescription,
    generateListingTitle,
    getAIServiceStatus,
} = require('../controllers/aiController');

// Public route to check AI service status
router.get('/status', getAIServiceStatus);

// Protected route to enhance listing descriptions
router.post('/enhance-description', protect, enhanceListingDescription);

// Protected route to generate listing titles
router.post('/generate-title', protect, generateListingTitle);

module.exports = router;
