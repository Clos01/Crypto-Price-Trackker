
export interface CoinSearchResult {
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }
  
  export interface CoinGeckoSearchResponse {
    categories: [],
    coins: CoinSearchResult[],
    ico:[],
    nfts:[]
  }
