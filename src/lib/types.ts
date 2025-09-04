export interface Pool {
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  category: "Lending" | "Liquid Staking" | "Yield Aggregator";
  predictions?: {
    predictedClass: string | null;
    predictedProbability: number | null;
    binnedConfidence: number | null;
  } | null;
  sigma?: number | null;
  apyMean30d?: number;
  pool: string;
  chain: string;
}

export interface PoolConfig {
  [key: string]: {
    category: "Lending" | "Liquid Staking" | "Yield Aggregator";
  };
}

export const poolCategories = [
  "All",
  "Lending",
  "Liquid Staking",
  "Yield Aggregator",
] as const;

export interface ChartDataPoint {
  timestamp: string;
  apy: number;
}
