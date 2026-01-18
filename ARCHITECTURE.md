# Architecture & API Configuration

## Amadeus API Setup

### Base URLs

Amadeus provides two environments:

1. **Test Environment** (for development/testing):
   - URL: `https://test.api.amadeus.com`
   - Free tier with rate limits
   - Use this for development and testing

2. **Production Environment** (for live applications):
   - URL: `https://api.amadeus.com`
   - Requires paid plan
   - Higher rate limits

### Current Implementation

**This app currently makes API calls directly from the frontend (React app).**

#### ✅ Works for Test Environment:
- Your API credentials are in `.env` file
- Frontend directly calls Amadeus API
- Fine for development and testing

#### ⚠️ Security Consideration for Production:

**For production, you should NOT expose your API secret in the frontend!**

Instead, you should:

1. **Create a Backend Server** (Node.js/Express, Python/Flask, etc.)
2. **Store API credentials on the backend** (never in frontend)
3. **Frontend calls your backend** → **Backend calls Amadeus API**
4. **Backend returns data to frontend**

### Recommended Production Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │         │   Your       │         │   Amadeus   │
│   Frontend  │ ──────> │   Backend    │ ──────> │   API       │
│             │         │   Server     │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │ (stores API secret securely)
                              │
```

### Environment Variables

Your `.env` file should contain:

```env
# For Test Environment (current setup)
REACT_APP_AMADEUS_API_KEY=your_api_key
REACT_APP_AMADEUS_API_SECRET=your_api_secret
REACT_APP_AMADEUS_BASE_URL=https://test.api.amadeus.com

# For Production (if using backend, you'd only need the base URL in frontend)
# REACT_APP_AMADEUS_BASE_URL=https://api.amadeus.com
```

### How to Find Your Base URL

The base URL depends on your Amadeus account type:

1. **Test/Sandbox Account**: Use `https://test.api.amadeus.com`
2. **Production Account**: Use `https://api.amadeus.com`

You can find this information in:
- Amadeus Developer Portal: https://developers.amadeus.com/
- Your app's dashboard
- API documentation

### Current Status

✅ **Your setup is correct for testing!**
- Base URL: `https://test.api.amadeus.com` (test environment)
- API calls work directly from frontend
- Perfect for development

When you're ready for production:
1. Set up a backend server
2. Move API secret to backend
3. Change base URL to `https://api.amadeus.com`
4. Update frontend to call your backend instead of Amadeus directly

