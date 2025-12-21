const { enhanceDescription, generateTitle, restructureFeatures, chatWithAI, isAIServiceAvailable } = require('../services/aiService');
const Listing = require('../models/listingModel');

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
 * @desc    Generate listing title using AI
 * @route   POST /api/ai/generate-title
 * @access  Private
 */
const generateListingTitle = async (req, res) => {
    try {
        if (!isAIServiceAvailable()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable.',
            });
        }

        const { description, category, features } = req.body;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Description is required to generate a title',
            });
        }

        const context = {
            category: category || '',
            features: features || [],
        };

        const generatedTitle = await generateTitle(description, context);

        res.status(200).json({
            success: true,
            data: {
                title: generatedTitle,
            },
        });
    } catch (error) {
        console.error('Generate Title Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate title',
        });
    }
};

/**
 * @desc    Restructure listing features using AI
 * @route   POST /api/ai/restructure-features
 * @access  Private
 */
const restructureListingFeatures = async (req, res) => {
    try {
        if (!isAIServiceAvailable()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable.',
            });
        }

        const { features } = req.body;

        if (!features || (typeof features === 'string' && features.trim().length === 0) || (Array.isArray(features) && features.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Features are required to restructure',
            });
        }

        const beautifiedFeatures = await restructureFeatures(features);

        res.status(200).json({
            success: true,
            data: {
                features: beautifiedFeatures,
            },
        });
    } catch (error) {
        console.error('Restructure Features Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to restructure features',
        });
    }
};

/**
 * @desc    Extract search filters from natural language query
 * @route   POST /api/ai/extract-intent
 * @access  Public
 */
const extractSearchFilters = async (req, res) => {
    try {
        if (!isAIServiceAvailable()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable.',
            });
        }

        const { query } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const filters = await extractSearchIntent(query);

        if (!filters) {
            return res.status(500).json({
                success: false,
                message: 'Failed to extract intent from query',
            });
        }

        res.status(200).json({
            success: true,
            data: filters,
        });
    } catch (error) {
        console.error('Extract Intent Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to extract intent',
        });
    }
};

/**
 * @desc    Chat with AI Assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chat = async (req, res) => {
    try {
        if (!isAIServiceAvailable()) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable.',
            });
        }

        const { message, listingId } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            });
        }

        let mode = 'platform';
        let contextData = {
            platformName: "Rentify",
            description: "Rentify is a comprehensive rental marketplace connecting owners with renters for various items/properties.",
            userRoles: {
                Owner: "Can list items, manage availability, accept/reject bookings, and earn money.",
                Renter: "Can search for items, book them, and leave reviews.",
                Admin: "Manages users, categories, and platform settings."
            },
            coreFeatures: [
                "AI-Powered Listing Assistant (generates titles, enhances descriptions, beautifies features)",
                "Secure Telebirr Payment Integration",
                "Real-time Messaging System",
                "Map-based Search & Filters",
                "User Verification System"
            ],
            howToRent: "1. Browse or search for items. 2. Select dates and request booking. 3. Wait for owner approval. 4. Complete payment via Telebirr. 5. Enjoy your rental!",
            howToList: "1. Register as an owner. 2. Go to 'Create Listing'. 3. Fill in details (Title, Description, Price, Photos). 4. Use AI tools for assistance. 5. Publish.",
            payments: "Payments are handled securely via Telebirr. Renters pay upon booking approval. Owners receive payouts after successful rental completion.",
            verification: "Users must verify their phone numbers/email to build trust on the platform.",
            support: "For account issues or disputes, please visit the 'Contact Us' page or email support@rentify.com."
        };

        // If listingId is provided, switch to listing mode and fetch context
        if (listingId) {
            mode = 'listing';
            try {
                const listing = await Listing.findById(listingId)
                    .select('title description price priceUnit category features location availability rating rules owner')
                    .populate('category', 'name')
                    .populate('owner', 'name')
                    .lean();

                if (listing) {
                    contextData = {
                        title: listing.title,
                        description: listing.description,
                        price: `${listing.price} per ${listing.priceUnit}`,
                        category: listing.category?.name || 'General',
                        location: `${listing.location?.city}, ${listing.location?.state}`,
                        features: listing.features || [],
                        availability: listing.availability,
                        rating: listing.rating?.average || 0,
                        owner: listing.owner?.name || 'Host'
                    };
                } else {
                    // If listing not found, fallback to platform mode but warn context
                    console.warn(`Listing ID ${listingId} not found for chat context.`);
                }
            } catch (err) {
                console.error('Error fetching listing context:', err);
            }
        }

        const reply = await chatWithAI(message, mode, contextData);

        res.status(200).json({
            success: true,
            data: {
                reply,
                mode
            },
        });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process chat',
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
    generateListingTitle,
    restructureListingFeatures,
    extractSearchFilters,
    chat,
    getAIServiceStatus,
};
