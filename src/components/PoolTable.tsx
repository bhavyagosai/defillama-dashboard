import type { Pool } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatProjectName, formatTvl } from "@/lib/utils";
import { ChainIcon } from "@/components/icons/ChainIcon";
import { ProjectAvatar } from "@/components/ProjectAvatar";
import { useRouter } from "next/navigation";

export function PoolTable({ pools }: { pools: Pool[] }) {
  const router = useRouter();

  function getPredictionVisuals(pool: Pool) {
    const predictedClass = pool.predictions?.predictedClass ?? null;
    const predictedProbability = pool.predictions?.predictedProbability ?? null;
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

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="md:sticky left-0 bg-background z-10">
              Project
            </TableHead>
            <TableHead className="text-center">Prediction</TableHead>
            <TableHead className="text-right">APY</TableHead>
            <TableHead className="text-right">30d Avg</TableHead>
            <TableHead className="text-right">Risk (σ)</TableHead>
            <TableHead className="text-right">TVL (USD)</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow
              key={pool.pool}
              className="cursor-pointer group hover:bg-muted/50"
              onClick={() => router.push(`/pool/${pool.pool}`)}
            >
              <TableCell className="md:sticky left-0 bg-background z-10">
                <div className="flex gap-3">
                  <ProjectAvatar name={formatProjectName(pool.project)} />
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">
                        {formatProjectName(pool.project)}
                      </div>
                      <Badge variant="outline">{pool.category}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1 gap-2">
                      <span>{pool.symbol}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <ChainIcon chain={pool.chain} className="h-3 w-3" />
                        <span>{pool.chain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {(() => {
                  const v = getPredictionVisuals(pool);
                  const Icon = v.Icon;
                  return (
                    <div className="inline-flex items-center gap-1">
                      <Icon className={`h-4 w-4 ${v.colorClass}`} />
                      <span className={`text-xs font-medium ${v.colorClass}`}>
                        {v.label}
                      </span>
                      {typeof v.probability === "number" && (
                        <span className="text-[10px] text-muted-foreground">
                          ({v.probability.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">
                {pool.apy != null ? `${pool.apy.toFixed(2)}%` : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                {pool.apyMean30d != null
                  ? `${pool.apyMean30d.toFixed(2)}%`
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                {pool.sigma != null ? pool.sigma.toFixed(4) : "N/A"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatTvl(pool.tvlUsd)}
              </TableCell>
              <TableCell>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:scale-125 transition-all" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
