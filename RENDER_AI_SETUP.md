# 🚀 Deploying AI Feature to Render

## Quick Fix for 500 Error

The 500 error you're seeing is because **GEMINI_API_KEY** is not set in your Render environment variables.

## Steps to Fix:

### 1. Get Your Gemini API Key (2 minutes)
1. Go to https://ai.google.dev/
2. Click "Get API key in Google AI Studio"
3. Sign in with Google
4. Click "Create API key in new project"
5. **Copy the key** (it starts with `AIza...`)

### 2. Add to Render Environment Variables (1 minute)
1. Go to https://render.com/dashboard
2. Select your **backend service** (Rentify backend)
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `[paste your API key here]`
6. Click **"Save Changes"**
7. Render will automatically redeploy

### 3. Wait for Redeploy (2-3 minutes)
- Render will restart your backend
- Wait for "Deploy succeeded" message
- Your AI feature will now work!

## Verify It's Working

After redeployment, test by:
1. Go to your live Rentify site
2. Create or edit a listing
3. Add a description
4. Click **"✨ Improve with AI"**
5. Should see enhanced description in 2-5 seconds!

## Troubleshooting

### Still getting 500 error?
- Check Render logs: Dashboard → Your Service → Logs
- Look for "AI service is currently unavailable"
- Verify GEMINI_API_KEY is set correctly (no spaces)

### API key not working?
- Verify the key at https://aistudio.google.com/app/apikey
- Make sure it's enabled
- Try regenerating the key

### Need to check if it's configured?
Test the status endpoint:
```
GET https://your-backend.onrender.com/api/ai/status
```

Should return:
```json
{
  "success": true,
  "data": {
    "available": true,
    "provider": "Google Gemini",
    "message": "AI service is available"
  }
}
```

## Other Environment Variables

Make sure these are also set in Render:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication
- `CLOUDINARY_CLOUD_NAME` - Image uploads
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Cost & Limits

✅ **Free Tier Limits:**
- 15 requests/minute
- 1,500 requests/day
- More than enough for testing and small production

## Need Help?

If you're still stuck:
1. Check Render logs for exact error
2. Verify all environment variables are set
3. Make sure backend is using latest code (commit & push)
4. Redeploy manually if needed

---

**Once configured, your AI feature will work perfectly! 🎉**
