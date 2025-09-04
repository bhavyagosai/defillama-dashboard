"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronsUpDown, X } from "lucide-react";

export interface FilterTvlRangeProps {
  label?: string;
  min?: number | null;
  max?: number | null;
  onChange: (next: { min: number | null; max: number | null }) => void;
}

export function FilterTvlRange({
  label = "TVL Range",
  min,
  max,
  onChange,
}: FilterTvlRangeProps) {
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState<string>(min?.toString() ?? "");
  const [localMax, setLocalMax] = useState<string>(max?.toString() ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        window.innerWidth >= 768 &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  function apply() {
    const parsedMin = localMin ? Number(localMin) : null;
    const parsedMax = localMax ? Number(localMax) : null;
    onChange({
      min: Number.isFinite(parsedMin) ? parsedMin : null,
      max: Number.isFinite(parsedMax) ? parsedMax : null,
    });
    setOpen(false);
  }

  function clear() {
    setLocalMin("");
    setLocalMax("");
    onChange({ min: null, max: null });
    setOpen(false);
  }

  const summary =
    min == null && max == null ? "All" : `${min ?? "-"} to ${max ?? "-"}`;

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs text-muted-foreground mb-1">
        {label}
      </label>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate text-left">{summary}</span>
        <ChevronsUpDown className="h-4 w-4 opacity-60" />
      </Button>
      {open && (
        <Card className="md:absolute z-20 mt-2 w-full md:w-[min(22rem,90vw)] p-3 shadow-lg space-y-3 right-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Set Range</span>
            <button
              type="button"
              className="p-1 rounded hover:bg-muted"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full bg-background border rounded-md px-2 py-1 text-sm"
                placeholder="e.g. 1000000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full bg-background border rounded-md px-2 py-1 text-sm"
                placeholder="e.g. 10000000"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={clear} className="cursor-pointer">
              Clear
            </Button>
            <Button onClick={apply} className="cursor-pointer">
              Apply
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
