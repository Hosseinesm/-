export interface MarketData {
  gold18k: string;
  usd: string;
  eur: string;
  oil: string;
  ounce: string;
}

export interface EssentialsData {
  rice: string;
  chicken: string;
  meat: string;
  sugar: string;
  eggs: string;
}

export interface DashboardData {
  market: MarketData;
  essentials: EssentialsData;
  lastUpdated: string;
  sources?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
