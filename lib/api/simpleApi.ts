import { TokenPriceParams, TokenPriceResult, AssetPlatform } from '../types/coingecko';

/**
 * Fetches token prices via the Next.js API route
 */
export async function getTokenPrices(params: TokenPriceParams): Promise<TokenPriceResult> {
  const queryParams = new URLSearchParams({
    platformId: params.platformId,
    contractAddress: params.contractAddress, // Single address
    vsCurrencies: params.vsCurrencies.join(','),
    includeMarketCap: String(params.includeMarketCap),
    include24hrVol: String(params.include24hrVol),
    include24hrChange: String(params.include24hrChange),
    includeLastUpdatedAt: String(params.includeLastUpdatedAt),
    ...(params.precision !== undefined && { precision: String(params.precision) }),
  });

  const response = await fetch(`/api/token-prices?${queryParams}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }

  return response.json();
}


/**
 * Fetches list of supported asset platforms directly from CoinGecko (no proxy)
 */
export async function getAssetPlatforms(filter?: string): Promise<AssetPlatform[]> {
    // Note:  Consider proxying this through a Next.js API route as well for consistency.
    const queryParams = new URLSearchParams(
        filter ? { filter } : {}
    );
    const response = await fetch(`https://api.coingecko.com/api/v3/asset_platforms?${queryParams}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`CoinGecko API Error: ${response.status} - ${errorData.error || "Unknown Error"}`);
    }
    return response.json();
}
