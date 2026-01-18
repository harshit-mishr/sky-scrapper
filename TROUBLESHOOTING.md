# Troubleshooting Guide

## API Not Working? Follow These Steps:

### 1. Check Environment Variables

Make sure your `.env` file is in the root directory and contains:

```env
REACT_APP_AMADEUS_API_KEY=your_key_here
REACT_APP_AMADEUS_API_SECRET=your_secret_here
REACT_APP_AMADEUS_BASE_URL=https://test.api.amadeus.com
```

**Important**: 
- Variable names MUST start with `REACT_APP_` for Create React App
- After changing `.env`, you MUST restart the dev server (`npm start`)

### 2. Verify Environment Variables Are Loaded

1. Open browser console (F12)
2. Look for log message: "Amadeus API Configuration"
3. Check if `hasApiKey` and `hasApiSecret` are `true`

If they're `false`, your `.env` file isn't being loaded. Try:
- Restart the dev server
- Check file is named exactly `.env` (not `.env.local` or `.env.development`)
- Check file is in the project root (same level as `package.json`)

### 3. Common Error Messages & Solutions

#### "Amadeus API credentials are missing"
- **Solution**: Check your `.env` file exists and has correct variable names
- Restart dev server after adding/editing `.env`

#### "Invalid API credentials" or "Authentication failed"
- **Solution**: 
  - Verify your API Key and Secret are correct
  - Check for extra spaces in `.env` file
  - Make sure you're using Test environment credentials (not Production)

#### "Network error: Unable to reach Amadeus API"
- **Possible CORS issue**: Amadeus test API should support CORS, but if you see this:
  - Check browser console for CORS errors
  - Try a different browser
  - Consider using a backend proxy (see below)

#### "Rate limit exceeded"
- **Solution**: Wait a few minutes and try again
- Test environment has rate limits

### 4. CORS Issues

If you're getting CORS errors in the browser console:

**Option A: Use a Backend Proxy (Recommended)**
Create a simple backend server that proxies requests to Amadeus:

```javascript
// Example Express.js proxy endpoint
app.post('/api/amadeus/token', async (req, res) => {
  // Get token from Amadeus
  // Return to frontend
});

app.get('/api/amadeus/flights', async (req, res) => {
  // Get flights from Amadeus
  // Return to frontend
});
```

**Option B: Use a CORS Proxy (Development Only)**
For testing, you can use a CORS proxy service, but this is NOT recommended for production.

### 5. Test API Credentials

Verify your credentials work by testing the token endpoint:

```bash
curl -X POST "https://test.api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_KEY&client_secret=YOUR_SECRET"
```

If this returns an access token, your credentials are valid.

### 6. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Go to Network tab
5. Try a search and check the API requests:
   - Are requests being made?
   - What's the response status?
   - What's the error message?

### 7. Verify API Endpoints

Make sure you're using the correct endpoints:
- Token: `/v1/security/oauth2/token`
- Airports: `/v1/reference-data/locations`
- Flights: `/v2/shopping/flight-offers`

### 8. Still Not Working?

1. **Check Amadeus Developer Portal**:
   - Log in to https://developers.amadeus.com/
   - Verify your app is active
   - Check if there are any restrictions

2. **Test with Postman/curl**:
   - Test the API directly to isolate if it's a frontend issue

3. **Check Network Tab**:
   - See if requests are being made
   - Check response status codes
   - Look at error messages in response

4. **Common Issues**:
   - Wrong base URL (using production instead of test)
   - Expired credentials
   - Account restrictions
   - Network/firewall blocking requests

### Quick Checklist

- [ ] `.env` file exists in project root
- [ ] Variables start with `REACT_APP_`
- [ ] Dev server restarted after `.env` changes
- [ ] API credentials are correct
- [ ] Using test environment URL
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows API requests

### Getting Help

If none of these work:
1. Check the browser console for specific error messages
2. Check the Network tab for failed requests
3. Share the specific error message you're seeing
4. Verify your Amadeus account status

