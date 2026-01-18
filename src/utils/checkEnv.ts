/**
 * Utility to check if environment variables are loaded correctly
 * This helps debug issues with .env file not being read
 */
export function checkAmadeusEnv(): {
  isValid: boolean;
  issues: string[];
  config: {
    hasApiKey: boolean;
    hasApiSecret: boolean;
    hasBaseUrl: boolean;
    apiKeyLength: number;
    baseUrl: string;
  };
} {
  const issues: string[] = [];
  const apiKey = process.env.REACT_APP_AMADEUS_API_KEY || '';
  const apiSecret = process.env.REACT_APP_AMADEUS_API_SECRET || '';
  const baseUrl = process.env.REACT_APP_AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

  if (!apiKey) {
    issues.push('REACT_APP_AMADEUS_API_KEY is missing');
  }

  if (!apiSecret) {
    issues.push('REACT_APP_AMADEUS_API_SECRET is missing');
  }

  if (!baseUrl) {
    issues.push('REACT_APP_AMADEUS_BASE_URL is missing');
  }

  return {
    isValid: issues.length === 0,
    issues,
    config: {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasBaseUrl: !!baseUrl,
      apiKeyLength: apiKey.length,
      baseUrl,
    },
  };
}

// Log environment check on module load (development only)
if (process.env.NODE_ENV === 'development') {
  const check = checkAmadeusEnv();
  if (!check.isValid) {
    console.warn('⚠️ Amadeus Environment Variables Check Failed:');
    check.issues.forEach((issue) => console.warn(`  - ${issue}`));
    console.warn('\n💡 Solution:');
    console.warn('  1. Make sure .env file exists in project root');
    console.warn('  2. Variables must start with REACT_APP_');
    console.warn('  3. Restart dev server: npm start');
  } else {
    console.log('✅ Amadeus Environment Variables Loaded:', check.config);
  }
}

