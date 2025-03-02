import { useState, useEffect } from 'react';

interface CoinData {
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number;
    sparkline_in_7d: { price: number[] };
  };
}

interface UseCoinDataResult {
  coinData: CoinData | null;
  loading: boolean;
  error: string | null;
}

export function useCoinData(coinId: string): UseCoinDataResult {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/coins/${coinId}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'An unknown error occurred');
          setCoinData(null);
          return;
        }

        const data = await response.json();
        setCoinData(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setCoinData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId]);

  return { coinData, loading, error };
}