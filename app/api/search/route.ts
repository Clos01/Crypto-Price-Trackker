import { NextRequest, NextResponse } from 'next/server';
import { COINGECKO_SEARCH_API_CONFIG } from '@/lib/config/coingeckoSearch';
import { CoinGeckoSearchResponse } from '@/lib/api/searchApi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  const url = `${COINGECKO_SEARCH_API_CONFIG.API_URL}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-cg-api-key': COINGECKO_SEARCH_API_CONFIG.API_KEY,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("CoinGecko Search API Error:", errorData);
      return NextResponse.json({ error: `CoinGecko API Error: ${response.status} - ${errorData.error || 'Unknown error'}` }, { status: response.status });
    }

    const data: CoinGeckoSearchResponse = await response.json();
    return NextResponse.json(data.coins); // Returns only the coins array

  } catch (error: any) {
    console.error("API Request Error:", error);
    return NextResponse.json({ error: `Failed to fetch search results: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}