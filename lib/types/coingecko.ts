export interface TokenPriceParams {
  platformId: string;
  contractAddresses: string[];
  vsCurrencies: string[];
  includeMarketCap?: boolean;
  include24hrVol?: boolean;
  include24hrChange?: boolean;
  includeLastUpdatedAt?: boolean;
  precision?: number;
}

export interface TokenPriceData {
  [key: string]: number | undefined;
}

export interface TokenPriceResult {
  [contractAddress: string]: {
    [key: string]: number | undefined;
  };
}

export interface AssetPlatform {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
  native_coin_id: string;
  image: {
    thumb?: string;
    small?: string;
    large?: string;
  };
}

export interface CoinGeckoError {
  error: string;
  status: {
    error_code: number;
    error_message: string;
  };
}
