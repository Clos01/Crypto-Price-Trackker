import { TokenPriceParams, TokenPriceResult, AssetPlatform, CoinGeckoError } from '../types/coingecko';
import { COINGECKO_CONFIG } from '../config/coingecko';

// Rate limiting utility
const rateLimiter = {
  lastCall: 0,
  minInterval: COINGECKO_CONFIG.RATE_LIMIT_MS,

  async throttle() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCall = Date.now();
  }
};

// Error handling utility
class CoinGeckoAPIError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'CoinGeckoAPIError';
  }
}

/**
 * Fetches token prices by contract addresses
 * @param params - Parameters for the token price request
 * @returns Promise with token price data
 * @throws CoinGeckoAPIError if the API request fails
 */
export async function getTokenPrices({
  platformId = COINGECKO_CONFIG.DEFAULT_PLATFORM_ID,
  contractAddresses,
  vsCurrencies,
  includeMarketCap = false,
  include24hrVol = false,
  include24hrChange = false,
  includeLastUpdatedAt = false,
  precision
}: TokenPriceParams): Promise<TokenPriceResult> {
  await rateLimiter.throttle();

  const queryParams = new URLSearchParams({
    contract_addresses: contractAddresses.join(','),
    vs_currencies: vsCurrencies.join(','),
    include_market_cap: String(includeMarketCap),
    include_24hr_vol: String(include24hrVol),
    include_24hr_change: String(include24hrChange),
    include_last_updated_at: String(includeLastUpdatedAt),
    ...(precision !== undefined && { precision: String(precision) })
  });

  try {
    const response = await fetch(
      `${COINGECKO_CONFIG.API_URL}/simple/token_price/${platformId}?${queryParams}`,
      { headers: COINGECKO_CONFIG.DEFAULT_HEADERS }
    );

    if (!response.ok) {
      const errorData: CoinGeckoError = await response.json();
      throw new CoinGeckoAPIError(
        errorData.error || errorData.status?.error_message || 'Failed to fetch token prices',
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof CoinGeckoAPIError) {
      throw error;
    }
    throw new CoinGeckoAPIError(
      'Failed to fetch token prices',
      500,
      { originalError: error }
    );
  }
}

/**
 * Fetches list of supported asset platforms
 * @param filter - Optional filter for NFT platforms
 * @returns Promise with array of asset platforms
 * @throws CoinGeckoAPIError if the API request fails
 */
export async function getAssetPlatforms(filter?: string): Promise<AssetPlatform[]> {
  await rateLimiter.throttle();

  const queryParams = new URLSearchParams(
    filter ? { filter } : {}
  );

  try {
    const response = await fetch(
      `${COINGECKO_CONFIG.API_URL}/asset_platforms${queryParams.toString() ? `?${queryParams}` : ''}`,
      { headers: COINGECKO_CONFIG.DEFAULT_HEADERS }
    );

    if (!response.ok) {
      const errorData: CoinGeckoError = await response.json();
      throw new CoinGeckoAPIError(
        errorData.error || errorData.status?.error_message || 'Failed to fetch asset platforms',
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof CoinGeckoAPIError) {
      throw error;
    }
    throw new CoinGeckoAPIError(
      'Failed to fetch asset platforms',
      500,
      { originalError: error }
    );
  }
}
