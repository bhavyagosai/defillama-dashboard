import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format large numbers
export function formatTvl(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}b`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}m`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(2)}k`;
  return `$${tvl.toFixed(2)}`;
}

// Format kebab-case into a title-cased string
export function formatProjectName(name: string): string {
  if (!name) return "";
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
