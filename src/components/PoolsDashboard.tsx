"use client";

import { useState } from "react";
import { poolCategories } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Lock, SlidersHorizontal } from "lucide-react";
import { PoolTable } from "./PoolTable";
import { PoolCard } from "./PoolCard";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import { useData } from "@/context/DataContext";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { FilterMultiSelect } from "./filters/FilterMultiSelect";
import { FilterTvlRange } from "./filters/FilterTvlRange";
import { FiltersModal } from "./filters/FiltersModal";

type Category = (typeof poolCategories)[number];

export function PoolsDashboard() {
  // Multi-filter state (empty set => All)
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Set<string>>(new Set());
  const [chains, setChains] = useState<Set<string>>(new Set());
  const [tvlRange, setTvlRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { isYieldAggregatorUnlocked } = useWallet();
  const { pools: allPools, isLoading, error } = useData();

  // Filter out Yield Aggregator pools from allPools if wallet is not connected
  const availablePools = isYieldAggregatorUnlocked
    ? allPools
    : allPools.filter((pool) => pool.category !== "Yield Aggregator");

  // Build option lists
  const allProjects = Array.from(
    new Set(availablePools.map((p) => p.project))
  ).sort();
  const allChains = Array.from(
    new Set(availablePools.map((p) => p.chain))
  ).sort();

  // Apply filters
  const filteredPools = availablePools.filter((pool) => {
    // category
    if (categories.size > 0 && !categories.has(pool.category)) return false;
    // project
    if (projects.size > 0 && !projects.has(pool.project)) return false;
    // chain
    if (chains.size > 0 && !chains.has(pool.chain)) return false;
    // tvl range
    if (tvlRange.min != null && pool.tvlUsd < tvlRange.min) return false;
    if (tvlRange.max != null && pool.tvlUsd > tvlRange.max) return false;
    return true;
  });

  const isEmpty = !allPools || allPools.length === 0;
  const isFilteredEmpty = filteredPools.length === 0;
  const isYieldAggregatorLocked =
    categories.has("Yield Aggregator") && !isYieldAggregatorUnlocked;

  // Show loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6 text-center text-destructive">
            Error loading pools: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        {/* Desktop Filters Bar - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          <FilterMultiSelect
            label="Category"
            options={["Lending", "Liquid Staking", "Yield Aggregator"]}
            selected={categories}
            onChange={setCategories}
            disabledOptions={
              !isYieldAggregatorUnlocked
                ? new Set(["Yield Aggregator"])
                : undefined
            }
          />
          <FilterMultiSelect
            label="Project"
            options={allProjects}
            selected={projects}
            onChange={setProjects}
          />
          <FilterMultiSelect
            label="Chain"
            options={allChains}
            selected={chains}
            onChange={setChains}
          />
          <FilterTvlRange
            label="TVL (USD)"
            min={tvlRange.min}
            max={tvlRange.max}
            onChange={setTvlRange}
          />
        </div>

        {/* Mobile Filters Button - Only visible on mobile */}
        <div className="md:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFiltersModal(true)}
            className="w-full justify-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center w-[calc(100%-8px)] md:w-fit gap-2">
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            className="cursor-pointer w-1/2 md:w-10"
            size="icon"
            onClick={() => setViewMode("table")}
            aria-label="Table View"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "card" ? "secondary" : "ghost"}
            className="cursor-pointer w-1/2 md:w-10"
            size="icon"
            onClick={() => setViewMode("card")}
            aria-label="Card View"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main>
        {/* Handle locked Yield Aggregator selection */}
        {isYieldAggregatorLocked ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Wallet Connection Required
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Connect your wallet to access Yield Aggregator pools and
                    unlock advanced DeFi strategies.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Yield Aggregator pools require wallet authentication for
                    security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isEmpty ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              No pools available. Please try again later.
            </CardContent>
          </Card>
        ) : isFilteredEmpty ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              No pools match current filters.
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <PoolTable pools={filteredPools} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => (
              <PoolCard key={pool.pool} pool={pool} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Filters Modal */}
      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        categories={categories}
        onCategoriesChange={setCategories}
        projects={projects}
        onProjectsChange={setProjects}
        chains={chains}
        onChainsChange={setChains}
        tvlRange={tvlRange}
        onTvlRangeChange={setTvlRange}
        allProjects={allProjects}
        allChains={allChains}
        isYieldAggregatorUnlocked={isYieldAggregatorUnlocked}
      />
    </div>
  );
}
