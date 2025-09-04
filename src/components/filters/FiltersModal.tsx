"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, SlidersHorizontal } from "lucide-react";
import { FilterMultiSelect } from "./FilterMultiSelect";
import { FilterTvlRange } from "./FilterTvlRange";

export interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Set<string>;
  onCategoriesChange: (next: Set<string>) => void;
  projects: Set<string>;
  onProjectsChange: (next: Set<string>) => void;
  chains: Set<string>;
  onChainsChange: (next: Set<string>) => void;
  tvlRange: { min: number | null; max: number | null };
  onTvlRangeChange: (next: { min: number | null; max: number | null }) => void;
  allProjects: string[];
  allChains: string[];
  isYieldAggregatorUnlocked: boolean;
}

export function FiltersModal({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
  projects,
  onProjectsChange,
  chains,
  onChainsChange,
  tvlRange,
  onTvlRangeChange,
  allProjects,
  allChains,
  isYieldAggregatorUnlocked,
}: FiltersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <Card className="w-full py-0 mx-4 mb-4 md:mb-0 h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <FilterMultiSelect
            label="Category"
            options={["Lending", "Liquid Staking", "Yield Aggregator"]}
            selected={categories}
            onChange={onCategoriesChange}
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
            onChange={onProjectsChange}
          />

          <FilterMultiSelect
            label="Chain"
            options={allChains}
            selected={chains}
            onChange={onChainsChange}
          />

          <FilterTvlRange
            label="TVL (USD)"
            min={tvlRange.min}
            max={tvlRange.max}
            onChange={onTvlRangeChange}
          />
        </div>
      </Card>
    </div>
  );
}
