'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePopularTokenPrices } from "@/lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol, TOKEN_NAMES } from "@/lib/config/coingecko";

export function CryptoGallery() {
  const { data: prices, isLoading, error, refetch } = usePopularTokenPrices(['usd'], true);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await refetch();
    setRetrying(false);
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <Card className="mb-4 border-destructive text-destructive-foreground">
        <CardContent>
          {error.message}
          {error.message.includes('Rate limit') && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="ml-2 underline"
            >
              {retrying ? 'Retrying...' : 'Retry'}
            </button>
          )}
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(prices).map(([tokenSymbol, priceData]) => {
        const contractAddress = COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES[tokenSymbol as TokenSymbol];
        const price = priceData?.[contractAddress]?.usd;

        return (
          <Card key={tokenSymbol} className="hover:shadow-lg transition-shadow lg:w-2/3 md:w-2/3 sm:w-3/4 mx-auto">
            <CardHeader>
              <CardTitle>{TOKEN_NAMES[tokenSymbol as TokenSymbol] || tokenSymbol} ({tokenSymbol})</CardTitle>
              <CardDescription>Current market price</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
              {price !== undefined ? (
                `$${price.toFixed(2)}`
              ) : (
                'Price unavailable'
              )}
            </div>
          </CardContent>
        </Card>
        );
    })}
  </div>
);
}
