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
import { ArrowUpRight } from "lucide-react";
import { formatProjectName, formatTvl } from "@/lib/utils";
import { ChainIcon } from "@/components/icons/ChainIcon";
import Link from "next/link";

export function PoolTable({ pools }: { pools: Pool[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead className="hidden lg:table-cell text-center">
              Prediction
            </TableHead>
            <TableHead className="text-right">APY</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              30d Avg
            </TableHead>
            <TableHead className="text-right hidden md:table-cell">
              Risk (σ)
            </TableHead>
            <TableHead className="text-right">TVL (USD)</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow
              key={pool.pool}
              className="cursor-pointer group hover:bg-muted/50"
            >
              <Link href={`/pool/${pool.pool}`} className="contents">
                <TableCell>
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
                </TableCell>
                <TableCell className="hidden lg:table-cell text-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {pool.predictions?.predictedClass || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {pool.apy != null ? `${pool.apy.toFixed(2)}%` : "N/A"}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {pool.apyMean30d != null
                    ? `${pool.apyMean30d.toFixed(2)}%`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {pool.sigma != null ? pool.sigma.toFixed(4) : "N/A"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatTvl(pool.tvlUsd)}
                </TableCell>
                <TableCell>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:scale-125 transition-all" />
                </TableCell>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
