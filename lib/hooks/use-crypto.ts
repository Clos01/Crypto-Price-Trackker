import { useQuery } from '@tanstack/react-query';
// import { getTokenPrices, getAssetPlatforms } from '../api/simpleApi';
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
 * Hook to fetch token prices by contract addresses.  
 * @param params - Parameters for token price request
 */
export function useTokenPrices(params: TokenPriceParams) {
    return useQuery({
        queryKey: cryptoKeys.tokenPrices(params),
        queryFn: async () => {
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

        },
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
    const tokens = Object.entries(COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES);

    // Use useTokenPrices for each token
    const results = tokens.map(([token, contractAddress]) => {
        const { data, isLoading, error } = useTokenPrices({
            platformId: COINGECKO_CONFIG.DEFAULT_PLATFORM_ID,
            contractAddress: contractAddress,
            vsCurrencies: vsCurrencies,
            includeMarketCap: includeExtendedData,
            include24hrVol: includeExtendedData,
            include24hrChange: includeExtendedData,
            includeLastUpdatedAt: includeExtendedData,
        });
        return { token, data, isLoading, error };
    });

  // Aggregate loading and error states
  const isLoading = results.some(result => result.isLoading);
  const error = results.find(result => result.error)?.error;

    // Aggregate data
    const data = results.reduce((acc: { [key: string]: any }, result) => {
        if (result.data) {
            acc[result.token] = result.data;
        }
        return acc;
    }, {});

  return { data, isLoading, error, refetch: () => results.forEach(result => result.data && result.data.refetch()) };
}
