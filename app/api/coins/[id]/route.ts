import { NextRequest, NextResponse } from 'next/server';
import { COINGECKO_CONFIG } from '@/lib/config/coingecko';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing coin ID' }, { status: 400 });
  }

  const url = `${COINGECKO_CONFIG.API_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-cg-api-key': COINGECKO_CONFIG.API_KEY,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("CoinGecko API Error:", errorData);
      return NextResponse.json({ error: `CoinGecko API Error: ${response.status} - ${errorData.error || 'Unknown error'}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Request Error:", error);
    return NextResponse.json({ error: `Failed to fetch coin data: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}