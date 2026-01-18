import axios, { AxiosInstance } from 'axios';
import type { FlightSearchParams, FlightSearchResponse, Airport } from '../types';
import '../utils/checkEnv'; // Check environment variables on load

const AMADEUS_API_KEY = process.env.REACT_APP_AMADEUS_API_KEY || 'YDM3s0bA9kwHmkLYPVYlMDHFrCKkqVBL';
const AMADEUS_API_SECRET = process.env.REACT_APP_AMADEUS_API_SECRET || 'nnFA4NU4y6dyd5nf';
const AMADEUS_BASE_URL = process.env.REACT_APP_AMADEUS_BASE_URL || 'https://test.api.amadeus.com';


class AmadeusService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: AMADEUS_BASE_URL,
    });
  }

 
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Validate credentials are present
    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      throw new Error('Amadeus API credentials are missing. Please check your .env file.');
    }

    try {
      const response = await axios.post(
        `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: AMADEUS_API_KEY,
          client_secret: AMADEUS_API_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token = response.data.access_token;
      if (!token) {
        throw new Error('No access token received from Amadeus API');
      }
      
      this.accessToken = token;
      // Set expiry to 25 minutes (5 min buffer before actual 30 min expiry)
      this.tokenExpiry = Date.now() + 25 * 60 * 1000;

      return token;
    } catch (error: any) {
      console.error('Failed to get Amadeus access token:', error);
      
      // Provide more detailed error messages
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          throw new Error('Invalid API credentials. Please check your API Key and Secret in .env file.');
        } else if (status === 403) {
          throw new Error('API access forbidden. Please check your Amadeus account status.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Authentication failed: ${errorData?.error_description || errorData?.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Network error or CORS issue
        throw new Error('Network error: Unable to reach Amadeus API. This might be a CORS issue. Consider using a backend proxy.');
      } else {
        throw new Error(`Failed to authenticate: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Search for airports by keyword (city or IATA code)
   */
  async searchAirports(keyword: string): Promise<Airport[]> {
    if (!keyword || keyword.length < 2) {
      return [];
    }

    try {
      const token = await this.getAccessToken();
      const response = await this.client.get('/v1/reference-data/locations', {
        params: {
          subType: 'AIRPORT',
          keyword: keyword.toUpperCase(),
          'page[limit]': 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data.map((airport: any) => ({
        iataCode: airport.iataCode,
        name: airport.name,
        cityName: airport.address?.cityName,
      }));
    } catch (error: any) {
      console.error('Error searching airports:', error);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      } else if (error.request) {
        console.error('Network Error - Request made but no response received');
      }
      
      return [];
    }
  }

  /**
   * Search for flight offers
   */
  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      const token = await this.getAccessToken();
      
      const searchParams: Record<string, string> = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: String(params.adults || 1),
        currencyCode: 'USD',
        max: '250', // Maximum results
      };

      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      if (params.children) {
        searchParams.children = String(params.children);
      }

      if (params.infants) {
        searchParams.infants = String(params.infants);
      }

      const response = await this.client.get('/v2/shopping/flight-offers', {
        params: searchParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        data: response.data.data || [],
        meta: response.data.meta,
      };
    } catch (error: any) {
      console.error('Error searching flights:', error);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        console.error('Network Error - Request made but no response received');
      }
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorDetail = error.response.data?.errors?.[0]?.detail || 'Invalid search parameters';
        throw new Error(`Invalid search parameters: ${errorDetail}`);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Token may have expired. Please try again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your API permissions.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (error.request) {
        // Network error or CORS issue
        throw new Error('Network error: Unable to reach Amadeus API. This might be a CORS issue. Consider using a backend proxy.');
      }
      
      const errorMessage = error.response?.data?.errors?.[0]?.detail 
        || error.response?.data?.error_description
        || error.message
        || 'Failed to search flights';
      
      throw new Error(errorMessage);
    }
  }
}

export const amadeusService = new AmadeusService();

