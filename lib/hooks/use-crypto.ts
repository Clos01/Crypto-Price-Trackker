import { useQuery } from '@tanstack/react-query';
import { getTokenPrices, getAssetPlatforms } from '../api/coingecko';
import type { TokenPriceParams } from '../types/coingecko';
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
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    enabled: params.contractAddresses.length > 0, // Only fetch if we have addresses to query
  });
}

/**
 * Hook to fetch popular token prices
 * @param vsCurrencies - Array of currencies to fetch prices in (default: ['usd'])
 * @param includeExtendedData - Whether to include market cap, volume, etc.
 */
export function usePopularTokenPrices(
  vsCurrencies: string[] = ['usd'],
  includeExtendedData = false
) {
  const addresses = Object.values(COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES);
  
  return useTokenPrices({
    platformId: COINGECKO_CONFIG.DEFAULT_PLATFORM_ID,
    contractAddresses: addresses,
    vsCurrencies,
    includeMarketCap: includeExtendedData,
    include24hrVol: includeExtendedData,
    include24hrChange: includeExtendedData,
    includeLastUpdatedAt: includeExtendedData,
  });
}

/**
 * Hook to fetch supported asset platforms
 * @param filter - Optional filter for platforms
 */
export function useAssetPlatforms(filter?: string) {
  return useQuery({
    queryKey: cryptoKeys.assetPlatforms(filter),
    queryFn: () => getAssetPlatforms(filter),
    staleTime: 24 * 60 * 60 * 1000, // Consider data stale after 24 hours
  });
}
