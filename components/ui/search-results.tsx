import React from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onCoinSelect?: (coinId: string) => void;
}

export function SearchResults({ results, isLoading, onCoinSelect }: SearchResultsProps) {
  if (isLoading) {
    return <div className="absolute w-full bg-background border rounded-lg p-4">Loading...</div>;
  }

  if (!results.length) {
    return null;
  }

  return (
    <div className="absolute w-full bg-background border rounded-lg shadow-lg p-4 mt-2">
      <ul className="space-y-2">
        {results.map((coin) => (
          <li 
            key={coin.id}
            className="hover:bg-accent rounded-md p-2 transition-colors"
            onClick={() => onCoinSelect?.(coin.id)}
          >
            <Link href={`/coins/${coin.id}`} className="flex items-center space-x-3">
              <img
                src={coin.thumb}
                alt={coin.name}
                className="w-6 h-6 rounded-full"
              />
              <div>
                <p className="font-medium">{coin.name}</p>
                <p className="text-sm text-muted-foreground">
                  {coin.symbol.toUpperCase()} 
                  {coin.market_cap_rank && ` • Rank #${coin.market_cap_rank}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
