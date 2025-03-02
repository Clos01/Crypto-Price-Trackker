'use client';

import Image from "next/image";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { usePopularTokenPrices } from "../lib/hooks/use-crypto";
import { COINGECKO_CONFIG, type TokenSymbol } from "../lib/config/coingecko";
import Footer from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navBar";
import { CryptoGallery } from "@/components/Gallery/CryptoGallery";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId);
    router.push(`/coins/${coinId}`);
    // You can add additional logic here, like fetching coin details
  };

  return (
    <div className="min-h-screen flex flex-col p-10">
      <Navbar onCoinSelect={handleCoinSelect} />
      <main className="flex-1 container py-8 p-10">
        <h1 className="text-3xl font-bold mb-6">Keep Track of Crypto Prices</h1>
        <p className="text-lg text-muted-foreground">
          See Default values below to see
        </p>
        <CryptoGallery />
      </main>
    </div>
  );
}
