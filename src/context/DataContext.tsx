"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pools");
      console.error("Error fetching pools:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPools = useCallback(async () => {
    await fetchPools();
  }, [fetchPools]);

  const getPoolChartDataCached = useCallback(async (poolId: string): Promise<ChartDataPoint[]> => {
    try {
      return await getPoolChartData(poolId);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      return [];
    }
  }, []);

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

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
