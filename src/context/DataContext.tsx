"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Pool, ChartDataPoint } from "@/lib/types";
import { getPools, getPoolChartData } from "@/lib/api";

interface DataContextType {
  pools: Pool[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshPools: () => Promise<void>;
  getPoolChartData: (poolId: string) => Promise<ChartDataPoint[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Cache duration: 5 minutes (300000ms)
const CACHE_DURATION = 5 * 60 * 1000;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPools = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPools();
      setPools(data);
      // update last updated date as now()
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pools");
      console.error("Error fetching pools:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // to trigger fresh api call. Not being used atm but just exposed it
  const refreshPools = useCallback(async () => {
    await fetchPools();
  }, [fetchPools]);

  // wrapper so components can fetch chart history on command but no caching for this as of now
  // as there would be a lot of (9 to be precise) object assigning for each pool data and perform check whenever we reach on that route
  // and check if data already there and use that and periodic fetch api for all just like pools which would be a big hassle acc to me
  // thus not done atm
  const getPoolChartDataCached = useCallback(
    async (poolId: string): Promise<ChartDataPoint[]> => {
      try {
        return await getPoolChartData(poolId);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        return [];
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const timeSinceLastUpdate = Date.now() - lastUpdated.getTime();
        if (timeSinceLastUpdate >= CACHE_DURATION) {
          fetchPools();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchPools, lastUpdated]);

  const value = {
    pools,
    isLoading,
    error,
    lastUpdated,
    refreshPools,
    getPoolChartData: getPoolChartDataCached,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
