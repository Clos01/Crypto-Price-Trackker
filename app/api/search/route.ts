import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const COINGECKO_SEARCH_API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  headers: {
    'Accept': 'application/json',
    'x-cg-api-key': API_KEY || ''
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const response = await fetch(
      `${COINGECKO_SEARCH_API_CONFIG.baseUrl}/search?query=${encodeURIComponent(query)}`,
      { headers: COINGECKO_SEARCH_API_CONFIG.headers }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from CoinGecko API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}