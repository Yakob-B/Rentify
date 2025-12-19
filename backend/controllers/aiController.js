const { enhanceDescription, isAIServiceAvailable } = require('../services/aiService');

/**
 * @desc    Enhance listing description using AI
 * @route   POST /api/ai/enhance-description
 * @access  Private
 */
const enhanceListingDescription = async (req, res) => {
    try {
        // Check if AI service is available
        if (!isAIServiceAvailable()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable. Please configure OPENROUTER_API_KEY.',
            });
        }

        const { description, title, category, features } = req.body;

        // Validate description
        if (!description || description.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Description is required',
            });
        }

        // Build context for better enhancement
        const context = {
            title: title || '',
            category: category || '',
            features: features || [],
        };

        // Enhance the description
        const enhancedDescription = await enhanceDescription(description, context);

        res.status(200).json({
            success: true,
            data: {
                original: description,
                enhanced: enhancedDescription,
            },
        });
    } catch (error) {
        console.error('Enhance Description Error:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to enhance description',
        });
    }
};

/**
 * @desc    Check AI service status
 * @route   GET /api/ai/status
 * @access  Public
 */
const getAIServiceStatus = async (req, res) => {
    const available = isAIServiceAvailable();

    res.status(200).json({
        success: true,
        data: {
            available,
            provider: 'OpenRouter (Free)',
            message: available
                ? 'AI service is available'
                : 'AI service is not configured. Add OPENROUTER_API_KEY to environment variables.',
        },
    });
};

module.exports = {
    enhanceListingDescription,
    getAIServiceStatus,
};
