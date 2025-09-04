"use client";

import { PoolDetailCard } from "@/components/PoolDetailCard";
import { HistoricalApyChart } from "@/components/HistoricalApyChart";
import { ProtectedPoolDetail } from "@/components/ProtectedPoolDetail";
import { useData } from "@/context/DataContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PoolDetailSkeleton } from "@/components/PoolDetailSkeleton";

interface PoolDetailPageProps {
  params: Promise<{ poolId?: string }>;
}

export default function PoolDetailPage({ params }: PoolDetailPageProps) {
  const [poolId, setPoolId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const { pools, getPoolChartData } = useData();

  // resolve params as they are received async
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPoolId(resolvedParams.poolId || null);
    };
    resolveParams();
  }, [params]);

  // fetch chart data
  useEffect(() => {
    if (poolId) {
      const fetchChartData = async () => {
        setIsLoadingChart(true);
        try {
          const data = await getPoolChartData(poolId);
          setChartData(data);
        } catch (error) {
          console.error("Error fetching chart data:", error);
          setChartData([]);
        } finally {
          setIsLoadingChart(false);
        }
      };
      fetchChartData();
    }
  }, [poolId, getPoolChartData]);

  // loading skeleton
  if (isLoadingChart) {
    return <PoolDetailSkeleton />;
  }

  // fallback view if no param found
  if (!poolId) {
    return (
      <main className="container p-4 md:p-8 flex flex-col gap-8">
        <header>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 text-muted-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>
        <div className="border">
          <p className="text-destructive font-medium">
            Invalid pool ID: missing or malformed.
          </p>
        </div>
      </main>
    );
  }

  const pool = pools.find((p) => p.pool === poolId);

  // fallback view if no pool found from param (pool ID)
  if (!pool) {
    return (
      <main className="container p-4 md:p-8 flex flex-col gap-8">
        <header>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 text-muted-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>
        <div className="w-full text-center">
          <p className="text-destructive font-medium">
            Pool not found or not accessible.
          </p>
        </div>
      </main>
    );
  }

  return (
    // this is to check if pool id is yield aggregator
    // if so then prevent display exploit
    <ProtectedPoolDetail poolId={poolId}>
      <main className="container p-4 md:p-8 flex flex-col gap-8">
        <header>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 text-muted-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>

        <PoolDetailCard pool={pool} />

        {isLoadingChart ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <HistoricalApyChart rawData={chartData} />
        )}
      </main>
    </ProtectedPoolDetail>
  );
}
