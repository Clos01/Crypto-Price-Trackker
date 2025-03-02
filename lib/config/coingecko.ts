// Get API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_COINGECKO_API_KEY environment variable is required');
}

export const COINGECKO_CONFIG = {
  // API Configuration
  API_URL: 'https://api.coingecko.com/api/v3',
  API_KEY,
  
  // Default Settings
  DEFAULT_PLATFORM_ID: 'ethereum', // Default blockchain platform
  DEFAULT_VS_CURRENCY: 'usd',
  
  // Rate Limiting
  RATE_LIMIT_MS: 1000, // 1 request per second for public API
  
  // Common Ethereum Token Addresses (examples)
  POPULAR_TOKEN_ADDRESSES: {
    'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
    'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
    'LINK': '0x514910771af9ca656af840dff83e8264ecf986ca'
  },
  
  // Supported Chains (examples)
  SUPPORTED_PLATFORMS: [
    'ethereum',
    'binance-smart-chain',
    'polygon-pos',
    'avalanche',
    'fantom',
    'arbitrum-one'
  ],
  
  // Request Headers
  DEFAULT_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-cg-api-key': API_KEY
  }
} as const;

// Type for supported platforms
export type SupportedPlatform = typeof COINGECKO_CONFIG.SUPPORTED_PLATFORMS[number];

// Type for token symbols
export type TokenSymbol = keyof typeof COINGECKO_CONFIG.POPULAR_TOKEN_ADDRESSES;

// Add a mapping for token names
export const TOKEN_NAMES: Record<TokenSymbol, string> = {
    'USDT': 'Tether',
    'USDC': 'USD Coin',
    'DAI': 'Dai',
    'LINK': 'Chainlink'
}
