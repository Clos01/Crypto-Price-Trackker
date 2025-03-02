// Get API key from environment variable
// services/coingecko.ts
import { CoinGeckoSearchResponse } from '@/lib/api/searchApi';

const API_KEY = process.env.COINGECKO_API_KEY;

if (!API_KEY) {
  throw new Error('COINGECKO_API_KEY environment variable is required');
}

export const COINGECKO_SEARCH_API_CONFIG = {
  // API Configuration
  API_URL: 'https://pro-api.coingecko.com/api/v3/search',
  API_KEY,

  

}