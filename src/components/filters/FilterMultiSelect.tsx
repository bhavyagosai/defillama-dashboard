"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterMultiSelectProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  placeholder?: string;
  disabledOptions?: Set<string>;
}

export function FilterMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
  disabledOptions,
}: FilterMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const normalized = useMemo(() => options.map((o) => String(o)), [options]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((o) => o.toLowerCase().includes(q));
  }, [normalized, query]);

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

  const isAllSelected = selected.size === 0; // empty => treat as all

  function toggleValue(value: string) {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  }

  function clearAll() {
    onChange(new Set());
  }

  const summary = isAllSelected
    ? "All"
    : Array.from(selected).slice(0, 2).join(", ") +
      (selected.size > 2 ? ` +${selected.size - 2}` : "");

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
        <span className="truncate text-left">{summary || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 opacity-60" />
      </Button>
      {open && (
        <Card className="md:absolute z-50 mt-2 w-full md:w-[min(22rem,90vw)] p-2 shadow-lg left-0 lg:right-0">
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full bg-transparent outline-none text-sm"
            />
            {!isAllSelected && (
              <button
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground underline"
                onClick={clearAll}
                type="button"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className={cn(
                "p-1 rounded hover:bg-muted cursor-pointer",
                query ? "block" : "hidden"
              )}
              onClick={() => setQuery("")}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-auto mt-2 pr-1">
            {filtered.map((opt) => {
              const disabled = disabledOptions?.has(opt);
              const active = selected.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-muted cursor-pointer"
                  )}
                  onClick={() => !disabled && toggleValue(opt)}
                >
                  <span
                    className={cn(
                      "h-4 w-4 inline-flex items-center justify-center rounded-sm border",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{`${opt} ${
                    disabled ? "(connect wallet to unlock)" : ""
                  }`}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-3 text-xs text-muted-foreground">
                No results
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
