import { useState } from 'react';
import { CoinSearchResult } from '@/lib/api/searchApi';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An unknown error occurred');
        setResults([]);
        return;
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { searchQuery, setSearchQuery, results, loading, error, handleSearch };
}