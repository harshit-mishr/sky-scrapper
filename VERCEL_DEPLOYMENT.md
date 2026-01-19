# Vercel Deployment Guide

## Quick Setup

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import your project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Create React App settings

3. **Configure Environment Variables:**
   In Vercel Dashboard → Project Settings → Environment Variables, add:
   ```
   REACT_APP_AMADEUS_API_KEY=your_api_key_here
   REACT_APP_AMADEUS_API_SECRET=your_api_secret_here
   REACT_APP_AMADEUS_BASE_URL=https://test.api.amadeus.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Configuration Files

- `vercel.json` - Already configured for Create React App
- `package.json` - Has `"homepage": "."` for relative paths
- Build output: `build/` directory

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Ensure all environment variables are set in Vercel dashboard
- Make sure Node.js version is compatible (Vercel uses Node 18.x by default)

### App Not Loading
- Check that `vercel.json` has the rewrite rules for SPA routing
- Verify `homepage` field in `package.json` is set to `"."`

### Environment Variables Not Working
- Variables must start with `REACT_APP_` to be included in the build
- After adding variables, trigger a new deployment
- Check build logs to verify variables are being read

## Notes

- The deprecation warning (`fs.F_OK`) is harmless and won't affect deployment
- Build warnings (unused variables) won't prevent deployment
- The app uses relative paths, so it works in any subdirectory

