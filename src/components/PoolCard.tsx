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
import { Shield, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { formatProjectName, formatTvl } from "@/lib/utils";
import { ChainIcon } from "@/components/icons/ChainIcon";

export function PoolCard({ pool }: { pool: Pool }) {
  const prediction = pool.predictions?.predictedClass || "N/A";

  return (
    <a
      href={`/pool/${pool.pool}`}
      className="hover:scale-105 hover:shadow-lg rounded-xl transition-all duration-200 ease-in-out block"
    >
      <Card className="h-full flex flex-col border-border/60 pb-0">
        <CardHeader>
          <div className="flex justify-between items-center gap-2">
            <div>
              <CardTitle>{formatProjectName(pool.project)}</CardTitle>
              <CardDescription>{pool.symbol}</CardDescription>
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
              <TrendingUp className="h-4 w-4" />
              <span>
                Prediction:{" "}
                <span className="font-semibold text-foreground">
                  {prediction}
                </span>
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
    </a>
  );
}
