import { useQuery } from '@tanstack/react-query';
import { COINGECKO_CONFIG, TokenSymbol } from '../config/coingecko';

const CACHE_TIME = 1000 * 60 * 15;  // ⏳ Keep data in cache for 15 minutes
const STALE_TIME = 1000 * 60 * 5;   // 🔄 Data is considered fresh for 5 minutes
const REFRESH_INTERVAL = 1000 * 60; // 🔄 Auto-refetch every 1 minute

export function usePopularTokenPrices(currencies: string[], enabled: boolean = true) {
  return useQuery({
    queryKey: ['tokenPrices', currencies],
    queryFn: async () => {
      try {
        const contractAddresses = Object.values(COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES).join(',');
        const currenciesStr = currencies.join(',');

        const response = await fetch(
          `${COINGECKO_CONFIG.API_URL}/simple/token_price/ethereum?contract_addresses=${contractAddresses}&vs_currencies=${currenciesStr}`,
          {
            headers: COINGECKO_CONFIG.DEFAULT_HEADERS,
          }
        );

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }

        return response.json();
      } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
      }
    },
    enabled,
    retry: 5, // ♻️ Retry up to 5 times before failing
    retryDelay: 10000, // ⏳ Wait 10 sec before each retry
    cacheTime: CACHE_TIME, // ⏳ Store API data for 15 minutes
    staleTime: STALE_TIME, // 🔄 Avoid unnecessary refetching for 5 minutes
    refetchInterval: REFRESH_INTERVAL, // 🔄 Refresh in the background every 2 min
  });
}
