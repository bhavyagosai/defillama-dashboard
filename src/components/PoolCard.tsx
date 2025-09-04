import type { Pool } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatProjectName, formatTvl } from "@/lib/utils";
import { ChainIcon } from "@/components/icons/ChainIcon";
import { ProjectAvatar } from "@/components/ProjectAvatar";
import Link from "next/link";

export function PoolCard({ pool }: { pool: Pool }) {
  const predictedClass = pool.predictions?.predictedClass ?? null;
  const predictedProbability = pool.predictions?.predictedProbability ?? null;

  function getPredictionVisuals() {
    if (!predictedClass) {
      return {
        label: "N/A",
        probability: null as number | null,
        Icon: Minus,
        colorClass: "text-muted-foreground",
      };
    }

    const normalized = predictedClass.toLowerCase();
    if (normalized === "up") {
      return {
        label: "Up",
        probability: predictedProbability,
        Icon: TrendingUp,
        colorClass: "text-[var(--primary)]",
      };
    }
    if (normalized === "down") {
      return {
        label: "Down",
        probability: predictedProbability,
        Icon: TrendingDown,
        colorClass: "text-[var(--destructive)]",
      };
    }
    return {
      label: predictedClass,
      probability: predictedProbability,
      Icon: TrendingUp,
      colorClass: "text-[var(--primary)]",
    };
  }

  const visuals = getPredictionVisuals();

  return (
    <Link
      href={`/pool/${pool.pool}`}
      className="hover:scale-105 hover:shadow-lg rounded-xl transition-all duration-200 ease-in-out block"
    >
      <Card className="h-full flex flex-col border-border/60 pb-0">
        <CardHeader>
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <ProjectAvatar name={formatProjectName(pool.project)} />
              <div>
                <CardTitle>{formatProjectName(pool.project)}</CardTitle>
                <CardDescription>{pool.symbol}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant="secondary">{pool.category}</Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ChainIcon chain={pool.chain} className="h-3 w-3" />
                <span>{pool.chain}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-3xl font-bold text-primary mb-4">
            {pool.apy != null ? `${pool.apy.toFixed(2)}%` : "N/A"}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              Current APY
            </span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                30d Avg APY:{" "}
                <span className="font-semibold text-foreground">
                  {pool.apyMean30d != null
                    ? `${pool.apyMean30d.toFixed(2)}%`
                    : "N/A"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <visuals.Icon className={`h-4 w-4 ${visuals.colorClass}`} />
              <span className="flex items-center gap-1">
                <span>Prediction:</span>
                <span className={`font-semibold ${visuals.colorClass}`}>
                  {visuals.label}
                </span>
                {typeof visuals.probability === "number" && (
                  <span className="text-xs text-muted-foreground">
                    ({visuals.probability.toFixed(0)}%)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>
                Risk (σ):{" "}
                <span className="font-semibold text-foreground">
                  {pool.sigma != null ? pool.sigma.toFixed(4) : "N/A"}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 rounded-b-xl">
          <div className="flex items-center gap-1.5 text-sm font-semibold w-full">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">TVL:</span>
            <span>{formatTvl(pool.tvlUsd)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
