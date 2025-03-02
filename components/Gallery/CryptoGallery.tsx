'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePopularTokenPrices } from "@/lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol } from "@/lib/config/coingecko";

export function CryptoGallery() {
  const { data: prices, isLoading, error } = usePopularTokenPrices(['usd'], true);
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
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
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
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(prices).map(([tokenSymbol, priceData]) => {
        const contractAddress = COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES[tokenSymbol as TokenSymbol];
        const price = priceData?.[contractAddress]?.usd;

        return (
          <Card key={tokenSymbol} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{tokenSymbol}</CardTitle>
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