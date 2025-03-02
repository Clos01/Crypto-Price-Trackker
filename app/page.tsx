'use client';

import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { usePopularTokenPrices } from "../lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol } from "../lib/config/coingecko";
import Footer from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navBar";

import { CryptoGallery }from "@/components/Gallery/CryptoGallery";



export default function Home() {
  const { data: prices, isLoading, error, refetch } = usePopularTokenPrices(['usd'], true);

  return (

    <div className="min-h-screen flex flex-col p-10">
    <Navbar />
    <main className="flex-1 container py-8 p-10">
      <h1 className="text-3xl font-bold mb-6">Keep Track of Crypto Prices</h1>
      <p className="text-lg text-muted-foreground">
        See Default values below to see
      </p>
      <CryptoGallery />

{/*
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
           <Card className="w-full sm:w-[350px]">
           <CardHeader>
            <CardTitle>Crypto Prices</CardTitle>
            <CardDescription>Popular cryptocurrency prices from CoinGecko.</CardDescription>
          </CardHeader>
          <CardContent>
           {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : prices && Object.keys(prices).length > 0 ? (
                <div className="grid gap-4">
                    {Object.entries(prices).map(([tokenSymbol, priceData]) => {
                        //Get the contract address for this token
                        const contractAddress = COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES[tokenSymbol as TokenSymbol];

                        // Check if we have price data for this contract address and for USD
                        if (priceData && priceData[contractAddress] && priceData[contractAddress].usd !== undefined) {
                            return (
                                <div key={tokenSymbol} className="flex items-center justify-between">
                                    <span>{tokenSymbol}</span>
                                    <span>${priceData[contractAddress].usd.toFixed(2)}</span>
                                </div>
                            );
                        }
                        return (
                          <div key={tokenSymbol} className="flex items-center justify-between">
                            <span>{tokenSymbol}</span>
                            <span>Price data unavailable</span>
                          </div>
                        )
                    })}
                </div>
            ) : (
              <p>No price data available.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => refetch()}>Refresh</Button>
          </CardFooter>
        </Card>
      </div> */}
    </main>
    </div>
  );
}
