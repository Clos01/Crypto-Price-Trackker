'use client';

import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { usePopularTokenPrices } from "../lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol } from "../lib/config/coingecko";
import Footer from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navBar";
export default function Home() {
  const { data: prices, isLoading, error, refetch } = usePopularTokenPrices(['usd'], true);

  return (

    <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to our website</h1>
      <p className="text-lg text-muted-foreground">
        This is a demo page showing our responsive navbar with search functionality.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-2">Card {i + 1}</h2>
            <p className="text-muted-foreground">This is a sample card to demonstrate the page content.</p>
          </div>
        ))}
      </div>
    </main>
  </div>
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //     <Card className="w-full sm:w-[350px]">
    //       <CardHeader>
    //         <CardTitle>Crypto Prices</CardTitle>
    //         <CardDescription>Popular cryptocurrency prices from CoinGecko.</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         {isLoading ? (
    //           <p>Loading...</p>
    //         ) : error ? (
    //           <p>Error: {error.message}</p>
    //         ) : prices && Object.keys(prices).length > 0 ? (
    //             <div className="grid gap-4">
    //                 {Object.entries(prices).map(([tokenSymbol, priceData]) => {
    //                     // Get the contract address for this token
    //                     const contractAddress = COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES[tokenSymbol as TokenSymbol];

    //                     // Check if we have price data for this contract address and for USD
    //                     if (priceData && priceData[contractAddress] && priceData[contractAddress].usd !== undefined) {
    //                         return (
    //                             <div key={tokenSymbol} className="flex items-center justify-between">
    //                                 <span>{tokenSymbol}</span>
    //                                 <span>${priceData[contractAddress].usd.toFixed(2)}</span>
    //                             </div>
    //                         );
    //                     }
    //                     return (
    //                       <div key={tokenSymbol} className="flex items-center justify-between">
    //                         <span>{tokenSymbol}</span>
    //                         <span>Price data unavailable</span>
    //                       </div>
    //                     )
    //                 })}
    //             </div>
    //         ) : (
    //           <p>No price data available.</p>
    //         )}
    //       </CardContent>
    //       <CardFooter>
    //         <Button onClick={() => refetch()}>Refresh</Button>
    //       </CardFooter>
    //     </Card>
    //     <Footer>
        
    //     </Footer>
    //   </main>
    // </div>
  );
}
