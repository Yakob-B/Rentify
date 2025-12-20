const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    enhanceListingDescription,
    generateListingTitle,
    restructureListingFeatures,
    getAIServiceStatus,
} = require('../controllers/aiController');

// Public route to check AI service status
router.get('/status', getAIServiceStatus);

// Protected route to enhance listing descriptions
router.post('/enhance-description', protect, enhanceListingDescription);

// Protected route to generate listing titles
router.post('/generate-title', protect, generateListingTitle);

// Protected route to restructure listing features
router.post('/restructure-features', protect, restructureListingFeatures);

module.exports = router;
