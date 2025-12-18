/**
 * Quick test script to check AI service status
 * Run this in browser console or as a separate test
 */

// Test 1: Check if AI service is available
fetch('https://rentify-0ic9.onrender.com/api/ai/status')
    .then(res => res.json())
    .then(data => {
        console.log('AI Service Status:', data);
        if (data.data.available) {
            console.log('✅ AI service is configured and available');
        } else {
            console.log('❌ AI service is NOT available:', data.data.message);
        }
    })
    .catch(err => console.error('Error checking status:', err));

// Test 2: Try enhancing a description (requires authentication)
// You'll need to add your auth token
const testEnhancement = (authToken) => {
    fetch('https://rentify-0ic9.onrender.com/api/ai/enhance-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            description: 'Nice apartment in the city center',
            title: 'Modern Apartment',
            category: 'Apartments',
            features: ['WiFi', 'Parking']
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('Enhancement Result:', data);
            if (data.success) {
                console.log('✅ Enhancement successful!');
                console.log('Original:', data.data.original);
                console.log('Enhanced:', data.data.enhanced);
            } else {
                console.log('❌ Enhancement failed:', data.message);
            }
        })
        .catch(err => console.error('Error enhancing:', err));
};

// To use: testEnhancement('your-auth-token-here');
