"use client";

import { useState } from "react";
import { poolCategories } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, LayoutGrid, Lock } from "lucide-react";
import { PoolTable } from "./PoolTable";
import { PoolCard } from "./PoolCard";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import { useData } from "@/context/DataContext";

type Category = (typeof poolCategories)[number];

export function PoolsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const { isYieldAggregatorUnlocked } = useWallet();
  const { pools: allPools, isLoading, error } = useData();

  // Filter out Yield Aggregator pools from allPools if wallet is not connected
  const availablePools = isYieldAggregatorUnlocked
    ? allPools
    : allPools.filter((pool) => pool.category !== "Yield Aggregator");

  // Filter pools based on the selected category
  const filteredPools =
    selectedCategory === "All"
      ? availablePools
      : availablePools.filter((pool) => pool.category === selectedCategory);

  const isEmpty = !allPools || allPools.length === 0;
  const isFilteredEmpty = filteredPools.length === 0;
  const isYieldAggregatorLocked =
    selectedCategory === "Yield Aggregator" && !isYieldAggregatorUnlocked;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Loading pools...</div>
        </div>
      </div>
    );
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Category Filter Tabs */}
        <Tabs
          defaultValue="All"
          onValueChange={(value) => setSelectedCategory(value as Category)}
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-full">
            {poolCategories.map((category) => {
              const isLocked =
                category === "Yield Aggregator" && !isYieldAggregatorUnlocked;
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`cursor-pointer flex items-center gap-2 relative group ${
                    isLocked ? "opacity-60" : ""
                  }`}
                >
                  {isLocked && <Lock className="h-4 w-4" />}
                  {category}
                  {isLocked && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Connect wallet to unlock
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            className="cursor-pointer"
            size="icon"
            onClick={() => setViewMode("table")}
            aria-label="Table View"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "card" ? "secondary" : "ghost"}
            className="cursor-pointer"
            size="icon"
            onClick={() => setViewMode("card")}
            aria-label="Card View"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main>
        {/* Handle locked Yield Aggregator category */}
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
                    security and compliance.
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
              No pools found in{" "}
              <span className="font-medium">{selectedCategory}</span> category.
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
    </div>
  );
}
