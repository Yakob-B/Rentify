const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Enhance a listing description using AI
 * @param {string} originalDescription - The original description to enhance
 * @param {object} context - Additional context (title, category, features)
 * @returns {Promise<string>} - Enhanced description
 */
const enhanceDescription = async (originalDescription, context = {}) => {
    // Check if API key is configured
    if (!genAI) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to environment variables.');
    }

    // Validate input
    if (!originalDescription || originalDescription.trim().length === 0) {
        throw new Error('Description cannot be empty');
    }

    try {
        // Get the Gemini model (using gemini-pro for text generation)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Build the prompt with context
        const prompt = buildEnhancementPrompt(originalDescription, context);

        // Generate enhanced description
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedText = response.text();

        return enhancedText.trim();
    } catch (error) {
        console.error('AI Enhancement Error:', error);

        // Provide meaningful error messages
        if (error.message?.includes('API key')) {
            throw new Error('Invalid API key. Please check your GEMINI_API_KEY configuration.');
        } else if (error.message?.includes('quota')) {
            throw new Error('AI service quota exceeded. Please try again later.');
        } else {
            throw new Error('Failed to enhance description. Please try again.');
        }
    }
};

/**
 * Build a well-structured prompt for description enhancement
 * @param {string} description - Original description
 * @param {object} context - Additional context
 * @returns {string} - Formatted prompt
 */
const buildEnhancementPrompt = (description, context) => {
    const { title, category, features } = context;

    let prompt = `You are a professional rental listing copywriter. Your task is to rewrite and enhance the following rental listing description while maintaining its original meaning and key information.

Original Description:
"${description}"
`;

    // Add context if provided
    if (title) {
        prompt += `\nListing Title: ${title}`;
    }
    if (category) {
        prompt += `\nCategory: ${category}`;
    }
    if (features && features.length > 0) {
        prompt += `\nKey Features: ${features.join(', ')}`;
    }

    prompt += `

Requirements:
1. Keep all factual information from the original description
2. Make it more engaging and professional
3. Use clear, concise language
4. Highlight key benefits and features
5. Keep it between 100-250 words
6. Use proper grammar and punctuation
7. Make it appealing to potential renters
8. Do NOT add false information or features not mentioned
9. Return ONLY the enhanced description, no extra commentary

Enhanced Description:`;

    return prompt;
};

/**
 * Check if AI service is available
 * @returns {boolean} - True if configured and ready
 */
const isAIServiceAvailable = () => {
    return !!genAI;
};

module.exports = {
    enhanceDescription,
    isAIServiceAvailable,
};
