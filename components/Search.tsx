'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CoinSearchResult } from '@/lib/api/searchApi';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
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

  return (
    <div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for coins..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="w-full"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {loading && <div className="mt-2">Loading...</div>}

      {!loading && results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <ul>
            {results.map((result) => (
              <li key={result.id} className="border-b py-2">
                <div className="flex items-center">
                    <img src={result.thumb} alt={result.name} className="w-6 h-6 mr-2" />
                    <div>
                        <span className="font-bold">{result.name}</span> ({result.symbol})
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}