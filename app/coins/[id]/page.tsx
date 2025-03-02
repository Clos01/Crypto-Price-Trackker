import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CoinPageProps {
  params: {
    id: string;
  };
}

export default async function CoinPage({ params }: CoinPageProps) {
  const { id } = params;

  const res = await fetch(`/api/coins/${id}`);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to fetch coin data');
  }

  const coinData = await res.json();

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>{coinData.name} ({coinData.symbol})</CardTitle>
          <CardDescription>Market Data (Powered by CoinGecko)</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Current Price: ${coinData.market_data.current_price.usd}</p>
          <p>Market Cap: ${coinData.market_data.market_cap.usd}</p>
          <p>24h High: ${coinData.market_data.high_24h.usd}</p>
          <p>24h Low: ${coinData.market_data.low_24h.usd}</p>
          <p>Circulating Supply: {coinData.market_data.circulating_supply}</p>
          <p>Total Supply: {coinData.market_data.total_supply}</p>

        </CardContent>
      </Card>
    </div>
  );
}