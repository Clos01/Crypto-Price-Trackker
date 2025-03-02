import { useQuery } from '@tanstack/react-query';
import { getTokenPrices, getAssetPlatforms } from '../api/simpleApi';
import type { TokenPriceParams, TokenPriceResult } from '../types/coingecko';
import { COINGECKO_CONFIG } from '../config/coingecko';

// Query keys for React Query cache management
export const cryptoKeys = {
  all: ['crypto'] as const,
  tokens: () => [...cryptoKeys.all, 'tokens'] as const,
  tokenPrices: (params: TokenPriceParams) => [...cryptoKeys.tokens(), params] as const,
  platforms: () => [...cryptoKeys.all, 'platforms'] as const,
  assetPlatforms: (filter?: string) => [...cryptoKeys.platforms(), { filter }] as const,
};

/**
 * Hook to fetch token prices by contract addresses
 * @param params - Parameters for token price request
 */
export function useTokenPrices(params: TokenPriceParams) {
    return useQuery({
        queryKey: cryptoKeys.tokenPrices(params),
        queryFn: () => getTokenPrices(params),
        refetchInterval: 60 * 1000, // Refetch every 60 seconds
        enabled: !!params.contractAddress, // Only fetch if we have an address
    });
}


/**
 * Hook to fetch popular token prices, modified for single-address API
 */
export function usePopularTokenPrices(
  vsCurrencies: string[] = [COINGECKO_CONFIG.DEFAULT_VS_CURRENCY],
  includeExtendedData = false
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['popularTokenPrices', vsCurrencies, includeExtendedData],
    queryFn: async () => {
      const results: { [token: string]: TokenPriceResult } = {};
      const tokens = Object.entries(COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES);

      // Use Promise.all to fetch prices concurrently, with a small delay
      await Promise.all(
        tokens.map(async ([token, contractAddress], index) => {
          // Introduce a small delay between requests to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, index * 100)); // 100ms delay

          try {
            const priceData = await getTokenPrices({
              platformId: COINGECKO_CONFIG.DEFAULT_PLATFORM_ID,
              contractAddress,
              vsCurrencies,
              includeMarketCap: includeExtendedData,
              include24hrVol: includeExtendedData,
              include24hrChange: includeExtendedData,
              includeLastUpdatedAt: includeExtendedData,
            });
            results[token] = priceData;
          } catch (err) {
            console.error(`Failed to fetch price for ${token}:`, err);
            // Don't re-throw, allow other requests to complete
          }
        })
      );
      return results;
    },
    refetchInterval: 60 * 1000,
  });

    return { data, isLoading, error, refetch };
}

