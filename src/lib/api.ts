import { ChartDataPoint, Pool, PoolConfig } from "./types";

// predefined mapping object with provided categorization
const POOL_CONFIG: PoolConfig = {
  // Lending Pools
  "db678df9-3281-4bc2-a8bb-01160ffd6d48": { category: "Lending" }, // aave-v3
  "c1ca08e4-d618-415e-ad63-fcec58705469": { category: "Lending" }, // compound-v3
  "8edfdf02-cdbb-43f7-bca6-954e5fe56813": { category: "Lending" }, // maple

  // Liquid Staking Pools
  "747c1d2a-c668-4682-b9f9-296708a3dd90": { category: "Liquid Staking" }, // lido
  "80b8bf92-b953-4c20-98ea-c9653ef2bb98": { category: "Liquid Staking" }, // binance-staked-eth
  "90bfb3c2-5d35-4959-a275-ba5085b08aa3": { category: "Liquid Staking" }, // stader

  // Yield Aggregator Pools
  "107fb915-ab29-475b-b526-d0ed0d3e6110": { category: "Yield Aggregator" }, // cian-yield-layer
  "05a3d186-2d42-4e21-b1f0-68c079d22677": { category: "Yield Aggregator" }, // yearn-finance
  "1977885c-d5ae-4c9e-b4df-863b7e1578e6": { category: "Yield Aggregator" }, // beefy
};

// ID List
const POOL_IDS = Object.keys(POOL_CONFIG);

/**
 * Fetches list of pools.
 * @returns An array of pools and their details inside it.
 */
export async function getPools(): Promise<Pool[]> {
  try {
    const response = await fetch("https://yields.llama.fi/pools");
    if (!response.ok) {
      throw new Error("Failed to fetch pools");
    }
    const data = await response.json();

    // Filter the API response to only include the pools we need
    const filteredPools: Pool[] = data.data.filter((pool: any) =>
      POOL_IDS.includes(pool.pool)
    );

    // Map and add our custom category to filtered pools
    const enrichedPools = filteredPools.map((pool) => ({
      ...pool,
      category: POOL_CONFIG[pool.pool].category,
    }));

    return enrichedPools;
  } catch (error) {
    console.error("Error fetching or processing pools:", error);
    return [];
  }
}

/**
 * Fetches historical APY data for a specific pool.
 * @param poolId - The ID of the pool to fetch chart data for.
 * @returns An array of chart data points.
 */
export async function getPoolChartData(
  poolId: string
): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`https://yields.llama.fi/chart/${poolId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data for pool ${poolId}`);
    }
    const data = await response.json();
    return data.data as ChartDataPoint[];
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}
