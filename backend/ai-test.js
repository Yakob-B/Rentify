const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { enhanceDescription, isAIServiceAvailable } = require('./services/aiService');

async function testAI() {
    console.log('--- OpenRouter FREE AI Test ---');
    console.log('AI Service Configured:', isAIServiceAvailable());
    console.log('OPENROUTER_API_KEY present:', !!process.env.OPENROUTER_API_KEY);
    console.log('Primary Model Override:', process.env.HF_MODEL || 'None (Using default list)');
    console.log('Note: We now try multiple free fallback models in sequence.');

    if (!isAIServiceAvailable()) {
        console.log('\nAI Service is NOT configured. Please add OPENROUTER_API_KEY to your .env file.');
        console.log('You can get a free key at: https://openrouter.ai/keys');
        return;
    }

    try {
        console.log('\nAttempting to enhance description...');
        const original = 'A simple room for rent in the city center. Includes a bed and a desk.';
        const result = await enhanceDescription(original, {
            title: 'Cozy City Center Room',
            category: 'Housing',
            features: ['Wi-Fi', 'Central Location', 'Furnished']
        });

        console.log('\nOriginal:', original);
        console.log('\nEnhanced:', result);

        if (result === original && original.length > 0) {
            console.log('\nNote: Received original text back. Check if the AI service reported an error in the logs.');
        } else {
            console.log('\nSUCCESS: OpenRouter AI enhancement worked!');
        }
    } catch (error) {
        console.error('\nAI Test Failed:', error.message);
    }
}

testAI();
