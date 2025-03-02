'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePopularTokenPrices } from "@/lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol } from "@/lib/config/coingecko";

export function CryptoGallery() {
  const { data: prices, isLoading, error } = usePopularTokenPrices(['usd'], true);

  if (isLoading) {
    return (
      <div className="grid place-items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!prices || Object.keys(prices).length === 0) {
    return <p>No price data available.</p>;
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