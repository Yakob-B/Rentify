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
                message: 'AI service is currently unavailable. Please configure GEMINI_API_KEY.',
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
    let availableModels = [];

    if (available) {
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const result = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).listModels();
            // Note: The SDK might have a direct listModels on genAI in newer versions
            // but let's try a safer way if that fails or use the specific method
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
            const data = await response.json();
            availableModels = data.models ? data.models.map(m => m.name.replace('models/', '')) : [];
        } catch (err) {
            console.error('Error fetching models:', err);
        }
    }

    res.status(200).json({
        success: true,
        data: {
            available,
            provider: 'Google Gemini',
            availableModels,
            message: available
                ? 'AI service is configured'
                : 'AI service is not configured. Add GEMINI_API_KEY to environment variables.',
            help: 'Check availableModels list for valid model names.'
        },
    });
};

module.exports = {
    enhanceListingDescription,
    getAIServiceStatus,
};
