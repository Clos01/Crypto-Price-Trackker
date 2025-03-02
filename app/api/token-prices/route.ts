import { NextRequest, NextResponse } from 'next/server';
import { COINGECKO_CONFIG } from '@/lib/config/coingecko';
import { TokenPriceParams, TokenPriceResult } from '@/lib/types/coingecko';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const platformId = searchParams.get('platformId') || COINGECKO_CONFIG.DEFAULT_PLATFORM_ID;
  const contractAddress = searchParams.get('contractAddress'); // Single address
  const vsCurrencies = searchParams.get('vsCurrencies');
  const includeMarketCap = searchParams.get('includeMarketCap') === 'true';
  const include24hrVol = searchParams.get('include24hrVol') === 'true';
  const include24hrChange = searchParams.get('include24hrChange') === 'true';
  const includeLastUpdatedAt = searchParams.get('includeLastUpdatedAt') === 'true';
  const precision = searchParams.get('precision');

  if (!contractAddress || !vsCurrencies) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const vsCurrenciesArray = vsCurrencies.split(',');

  // Basic contract address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return NextResponse.json({ error: "Invalid contract address format" }, { status: 400 });
  }

  const params: TokenPriceParams = {
    platformId,
    contractAddress, // Single address
    vsCurrencies: vsCurrenciesArray,
    includeMarketCap,
    include24hrVol,
    include24hrChange,
    includeLastUpdatedAt,
    ...(precision && { precision: parseInt(precision, 10) }),
  };

  const queryParams = new URLSearchParams({
    contract_addresses: params.contractAddress, // Single address
    vs_currencies: params.vsCurrencies.join(','),
    include_market_cap: String(params.includeMarketCap),
    include_24hr_vol: String(params.include24hrVol),
    include_24hr_change: String(params.include24hrChange),
    include_last_updated_at: String(params.includeLastUpdatedAt),
    ...(params.precision !== undefined && { precision: String(params.precision) })
  });

  try {
    const response = await fetch(
      `${COINGECKO_CONFIG.API_URL}/simple/token_price/${params.platformId}?${queryParams}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-cg-api-key': COINGECKO_CONFIG.API_KEY,
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("CoinGecko API Error:", errorData);
      return NextResponse.json({ error: `CoinGecko API Error: ${response.status} - ${errorData.error || 'Unknown error'}` }, { status: response.status });
    }

    const data: TokenPriceResult = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Request Error:", error);
    return NextResponse.json({ error: `Failed to fetch token prices: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
