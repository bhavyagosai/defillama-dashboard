"use client";

import { useWallet } from "@/context/WalletContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProtectedPoolDetailProps {
  poolId: string;
  children: React.ReactNode;
}

export function ProtectedPoolDetail({ poolId, children }: ProtectedPoolDetailProps) {
  const { isYieldAggregatorUnlocked } = useWallet();
  const { pools } = useData();

  // Find the pool to check its category
  const pool = pools.find((p) => p.pool === poolId);
  const isYieldAggregatorPool = pool?.category === "Yield Aggregator";

  // If it's a Yield Aggregator pool and wallet is not connected, show locked state
  if (isYieldAggregatorPool && !isYieldAggregatorUnlocked) {
    return (
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        <header>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex items-center gap-2 text-muted-foreground"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>

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
                  This Yield Aggregator pool requires wallet authentication to access detailed information.
                </p>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Yield Aggregator pools require wallet authentication for security and compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // If pool is not found, show error
  if (!pool) {
    return (
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        <header>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex items-center gap-2 text-muted-foreground"
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

  // If pool is accessible, render the children
  return <>{children}</>;
}
