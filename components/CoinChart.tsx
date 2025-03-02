"use client"

import { ArrowDown, ArrowUp, ChevronDown, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCoinData } from "@/lib/hooks/use-coin-data";
import { useState } from "react"
import { AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area } from "recharts";

interface ChartProps {
  data: { date: string; price: number }[];
  isPositive: boolean;
}
// Custom tooltip component
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3">
        <p className="text-sm font-medium">{payload[0].payload.date}</p>
        <p className="text-lg font-bold">{formatCurrency(Number.parseFloat(payload[0].value))}</p>
      </div>
    )
  }
  return null;
}

// Price display component
const PriceDisplay = ({ currentPrice, percentChange, isPositive }: {currentPrice: number, percentChange: number, isPositive: boolean}) => (
  <div>
    <div className="text-3xl font-bold">{formatCurrency(currentPrice)}</div>
    <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
      <span className="font-medium">{percentChange.toFixed(2)}%</span>
      <CardDescription className="ml-2">24h</CardDescription>
    </div>
  </div>
)

// Chart component
const Chart = ({ data, isPositive }: ChartProps) => {

    return (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value: string) => {
            return value.split("-")[2] // Just the day
          }}
          minTickGap={30}
        />
        <YAxis
          domain={["dataMin - 100", "dataMax + 100"]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value: number) => `$${value}`}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
          fillOpacity={1}
          fill="url(#colorPrice)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)
        }

// Format currency for display
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface CoinChartProps {
    coinId: string;
}

export function CoinChart({coinId}: CoinChartProps) {
    const { coinData, loading, error } = useCoinData(coinId);
    const [timeRange, setTimeRange] = useState("7D"); // Default to 7 days

     const calculatePriceMetrics = (data: { date: string; price: number }[]) => {
        if (data.length === 0) {
            return {
                currentPrice: 0,
                previousPrice: 0,
                priceChange: 0,
                percentChange: 0,
                isPositive: false
            }
        }
        const currentPrice = data[data.length - 1].price;
        const previousPrice = data[0].price
        const priceChange = currentPrice - previousPrice;
        const percentChange = (priceChange / previousPrice) * 100;
        const isPositive = percentChange >= 0;

        return {
            currentPrice,
            previousPrice,
            priceChange,
            percentChange,
            isPositive,
        };
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!coinData) {
        return <div>No data available</div>
    }

     const sparklineData = coinData.market_data.sparkline_in_7d.price;
    let chartData: { date: string; price: number }[] = [];

    // Create data points with dates (for simplicity, we'll just use indices as days)
    if (timeRange === "7D") {
        chartData = sparklineData.map((price, index) => ({
            date: `Day ${index}`,
            price,
        }));
    } else if (timeRange === "1D") {
        //take every 7th data point to simulate 1 day
        chartData = sparklineData.filter((price, index) => index % 7 === 0).map((price, index) => ({
            date: `Hour ${index}`,
            price
        }))
    }


    const { currentPrice, percentChange, isPositive } = calculatePriceMetrics(chartData);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-500 font-bold">{coinData.symbol.toUpperCase()}</span>
            </div>
            <div>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-0 font-normal"> */}
                    <CardTitle className="text-xl flex items-center gap-1">
                      {coinData.name} <ChevronDown className="h-4 w-4" />
                    </CardTitle>
                  {/* </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onCurrencyChange("Bitcoin (BTC)")}>Bitcoin (BTC)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCurrencyChange("Ethereum (ETH)")}>Ethereum (ETH)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCurrencyChange("Solana (SOL)")}>Solana (SOL)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Info className="h-4 w-4" />
            <span className="sr-only">Information</span>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
          <PriceDisplay
            currentPrice={currentPrice}
            percentChange={percentChange}
            isPositive={isPositive}
          />
          <Tabs
            defaultValue={timeRange}
            onValueChange={(value: string) => setTimeRange(value)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="7D">7D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Chart data={chartData} isPositive={isPositive}  />
      </CardContent>
    </Card>
  )
}