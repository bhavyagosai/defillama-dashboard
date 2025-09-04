"use client";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DashboardSkeleton } from "./DashboardSkeleton";

export function LockedPoolsView() {
  return (
    <Card className="relative flex flex-col items-center justify-center p-8 text-center border-dashed">
      {/* Blurred background skeleton */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="blur-sm scale-105 opacity-50">
          <DashboardSkeleton />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3 bg-secondary rounded-full border">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Content Locked</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          The Yield Aggregator category is only available to connected users.
          Please connect your wallet to view these pools.
        </p>
        <div className="mt-6">
          {/* RainbowKit's Connect Button */}
          <ConnectButton
            label="Connect Wallet"
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </Card>
  );
}
