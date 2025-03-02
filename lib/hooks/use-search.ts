import { useState } from 'react';
import { COINGECKO_CONFIG } from '../config/coingecko';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large?: string;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      setResults(data.coins || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    error,
    handleSearch,
  };
}