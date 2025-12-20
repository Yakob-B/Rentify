const axios = require('axios');

// OpenRouter Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_FREE_MODELS = [
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'openchat/openchat-7b:free'
];
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Enhance a listing description using OpenRouter (Free Tier)
 * @param {string} originalDescription - The original description to enhance
 * @param {object} context - Additional context (title, category, features)
 * @returns {Promise<string>} - Enhanced description
 */
const enhanceDescription = async (originalDescription, context = {}) => {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
        console.warn('OPENROUTER_API_KEY not found. AI enhancement might fail. Please add it to your .env file.');
        return originalDescription;
    }

    // Validate input
    if (!originalDescription || originalDescription.trim().length === 0) {
        return originalDescription;
    }

    // Determine target models - use user choice or our fallback list
    const userModel = process.env.HF_MODEL;
    const modelsToTry = userModel && !userModel.includes('undefined')
        ? [userModel, ...DEFAULT_FREE_MODELS]
        : DEFAULT_FREE_MODELS;

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`Attempting AI enhancement with OpenRouter model: ${model}`);

            const { systemPrompt, userPrompt } = buildChatPrompts(originalDescription, context);

            const response = await axios.post(
                API_URL,
                {
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
                        'X-Title': 'Rentify AI Enhancer',      // Required by OpenRouter
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000 // Shorter timeout per model to fail fast and move to next
                }
            );

            // OpenRouter uses the OpenAI format
            let enhancedText = response.data?.choices?.[0]?.message?.content || '';

            // Clean up instruction tokens that some free models accidentally include
            enhancedText = enhancedText
                .replace(/\[\/?B_INST\]/gi, '')
                .replace(/\[\/?INST\]/gi, '')
                .replace(/\[\/?OUT\]/gi, '')
                .replace(/\[\/?BOT\]/gi, '')
                .replace(/<\/?s>/gi, '')
                .trim();

            if (enhancedText && enhancedText.length > 20) {
                console.log(`Success with model: ${model}`);
                return enhancedText.trim();
            } else {
                console.warn(`Model ${model} returned empty or short response, trying next model.`);
                lastError = new Error(`Model ${model} returned empty or short response.`);
                continue;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error?.message || error.response?.data?.error || error.message;
            console.warn(`Model ${model} failed:`, errorMsg);
            lastError = error;

            // If it's an API key error, don't try other models
            if (errorMsg?.includes('API key') || error.response?.status === 401) {
                break;
            }
            // If it's a "No endpoints found" error, it means the model is unavailable, try next
            if (errorMsg?.includes('No endpoints found')) {
                continue;
            }
            // Otherwise continue to next model
            continue;
        }
    }

    // If we reach here, all models failed or an unrecoverable error occurred
    if (lastError) {
        const errorMsg = lastError.response?.data?.error?.message || lastError.message;
        console.error('OpenRouter AI Error after all retries:', errorMsg);

        // Friendly errors for common issues
        if (lastError.response?.status === 429) {
            throw new Error('The free AI service is currently busy. Please try again in a few seconds.');
        } else if (lastError.code === 'ECONNABORTED') {
            throw new Error('AI enhancement timed out. Free models can sometimes be slow.');
        } else if (errorMsg?.includes('API key')) {
            throw new Error('Invalid OpenRouter API key. Please check your .env configuration.');
        }

        // Graceful fallback to original description so the user can still save their listing
        return originalDescription;
    }
};

/**
 * Build chat prompts
 */
const buildChatPrompts = (description, context) => {
    const { title, category, features } = context;

    let contextDetails = '';
    if (title) contextDetails += `- Title: ${title}\n`;
    if (category) contextDetails += `- Category: ${category}\n`;
    if (features && features.length > 0) contextDetails += `- Features: ${features.join(', ')}\n`;

    const systemPrompt = `You are a professional real estate and rental listing copywriter. 
Your task is to rewrite and enhance rental listing descriptions to be more professional, engaging, and inviting for potential renters.
Always maintain factual accuracy. Do not add features that are not mentioned.
Return ONLY the enhanced description. No introductions, no signatures.`;

    const userPrompt = `Please enhance this rental listing:

${contextDetails}

Original Description:
"${description}"

Requirements:
- Professional and appealing tone.
- Clear structure.
- Focus on benefits.
- Return ONLY the clean description text.`;

    return { systemPrompt, userPrompt };
};

/**
 * Generate a short, clear rental listing title
 * @param {string} description - The listing description
 * @param {object} context - Additional context (category, features)
 * @returns {Promise<string>} - Generated title
 */
const generateTitle = async (description, context = {}) => {
    if (!OPENROUTER_API_KEY) return '';
    if (!description || description.trim().length === 0) return '';

    const { category, features } = context;
    const userModel = process.env.HF_MODEL;
    const modelsToTry = userModel && !userModel.includes('undefined')
        ? [userModel, ...DEFAULT_FREE_MODELS]
        : DEFAULT_FREE_MODELS;

    for (const model of modelsToTry) {
        try {
            const systemPrompt = `You are a professional real-estate listing assistant.
Generate a short, clear rental listing title from the description provided.

Rules:
- Maximum 10 words
- Professional and neutral tone
- No emojis
- No marketing phrases (e.g., amazing, perfect, luxury)
- No punctuation at the end
- Use proper capitalization
- Output ONLY the title text`;

            const userPrompt = `Description:
${description}

${category ? `Category: ${category}` : ''}
${features && features.length > 0 ? `Features: ${features.join(', ')}` : ''}

Generated Title:`;

            const response = await axios.post(
                API_URL,
                {
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.5,
                    max_tokens: 50
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'Rentify AI Title Generator',
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            let title = response.data?.choices?.[0]?.message?.content || '';

            // Clean up and enforce rules
            title = title.replace(/^["']|["']$/g, '').trim();
            if (title.endsWith('.')) title = title.slice(0, -1);

            // Basic marketing filter (additional safety)
            const marketingWords = ['amazing', 'perfect', 'luxury', 'stunning', 'incredible', 'dream'];
            marketingWords.forEach(word => {
                const reg = new RegExp(`\\b${word}\\b`, 'gi');
                title = title.replace(reg, '');
            });
            title = title.replace(/\s+/g, ' ').trim();

            if (title && title.split(' ').length <= 12) {
                return title;
            }
        } catch (error) {
            console.warn(`Model ${model} failed for title generation:`, error.message);
            continue;
        }
    }
    return '';
};

/**
 * Restructure and beautify listing features
 * @param {string|string[]} features - The list of features
 * @param {object} context - Additional context
 * @returns {Promise<string>} - Cleaned features as a comma-separated string
 */
const restructureFeatures = async (features, context = {}) => {
    if (!OPENROUTER_API_KEY) return '';

    // Normalize input to string
    const featuresString = Array.isArray(features) ? features.join(', ') : features;
    if (!featuresString || featuresString.trim().length === 0) return '';

    const userModel = process.env.HF_MODEL;
    const modelsToTry = userModel && !userModel.includes('undefined')
        ? [userModel, ...DEFAULT_FREE_MODELS]
        : DEFAULT_FREE_MODELS;

    for (const model of modelsToTry) {
        try {
            const systemPrompt = `You are a professional real-estate listing assistant.
Your task is to beautify and restructure a list of rental listing features into a clean, professional, and standardized format.

Rules:
- Standardize naming (e.g., "WiFi" instead of "wifi", "Air Conditioning" instead of "ac").
- Clean up capitalization (Title Case).
- Remove duplicates.
- Do NOT add new features not present in the input.
- Keep the meaning exactly the same.
- Output ONLY a clean comma-separated list.`;

            const userPrompt = `Input Features: ${featuresString}
Beautified Features:`;

            const response = await axios.post(
                API_URL,
                {
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3, // Lower temperature for more factual restructuring
                    max_tokens: 200
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'Rentify AI Feature Beautifier',
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            let cleanedFeatures = response.data?.choices?.[0]?.message?.content || '';
            cleanedFeatures = cleanedFeatures.replace(/^["']|["']$/g, '').trim();
            if (cleanedFeatures.endsWith('.')) cleanedFeatures = cleanedFeatures.slice(0, -1);

            if (cleanedFeatures && cleanedFeatures.length > 5) {
                return cleanedFeatures;
            }
        } catch (error) {
            console.warn(`Model ${model} failed for feature restructuring:`, error.message);
            continue;
        }
    }
    return featuresString; // Fallback to original
};

/**
 * Check if AI service is available
 */
const isAIServiceAvailable = () => {
    return !!OPENROUTER_API_KEY;
};

module.exports = {
    enhanceDescription,
    generateTitle,
    restructureFeatures,
    isAIServiceAvailable,
};
