
export type TabType = 'launcher' | 'swap' | 'earn';

export interface TokenForm {
  name: string;
  ticker: string;
  description: string;
  imageFile: File | null;
  initialBuy: string;
}

export interface Pool {
  id: string;
  pair: string;
  apy: string;
  tvl: string;
  rewardToken: string;
}
