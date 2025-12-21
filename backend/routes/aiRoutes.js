const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    enhanceListingDescription,
    generateListingTitle,
    restructureListingFeatures,
    extractSearchFilters,
    chat,
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

// Public route to extract search intent (public to allow NL search for visitors)
router.post('/extract-intent', extractSearchFilters);

// Protected route for AI chat
router.post('/chat', protect, chat);

module.exports = router;
