"use client";

import { cn } from "@/lib/utils";

function hashStringToHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

function pickInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+|[-_]+/);
  const firstTwo = (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  if (firstTwo.trim().length >= 2) return firstTwo.slice(0, 2);
  return (parts[0]?.[0] || "?").toUpperCase();
}

export function ProjectAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const hue = hashStringToHue(name);
  const bg = `hsl(${hue} 70% 45%)`;
  const initials = pickInitials(name);
  return (
    <div
      aria-hidden
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-md text-white font-bold",
        className,
      )}
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}


