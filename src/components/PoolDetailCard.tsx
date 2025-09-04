import type { Pool } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Calendar,
  Info,
} from "lucide-react";
import { formatProjectName, formatTvl } from "@/lib/utils";
import { ChainIcon } from "@/components/icons/ChainIcon";

export function PoolDetailCard({ pool }: { pool: Pool }) {
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
    <Card className="border-border/60">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl">
              {formatProjectName(pool.project)}
            </CardTitle>
            <Badge variant="secondary" className="text-md">
              {pool.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <span>{pool.symbol}</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ChainIcon chain={pool.chain} className="h-4 w-4" />
              <span>{pool.chain}</span>
            </div>
          </div>
        </div>
        <div className="text-4xl font-bold text-green-500">
          {pool.apy != null ? `${pool.apy.toFixed(2)}%` : "N/A"}
          <span className="text-base font-normal text-muted-foreground ml-2">
            Current APY
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <InfoItem
            icon={Calendar}
            label="30d Avg APY"
            value={
              pool.apyMean30d != null ? `${pool.apyMean30d.toFixed(2)}%` : "N/A"
            }
          />
          <InfoItem
            icon={visuals.Icon}
            label="Prediction"
            value={`${visuals.label}${
              typeof visuals.probability === "number"
                ? ` (${visuals.probability.toFixed(0)}%)`
                : ""
            }`}
            valueClassName={visuals.colorClass}
          />
          <InfoItem
            icon={Shield}
            label="Risk (σ)"
            value={pool.sigma != null ? pool.sigma.toFixed(4) : "N/A"}
          />
          <InfoItem
            icon={DollarSign}
            label="Total Value Locked"
            value={formatTvl(pool.tvlUsd)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// A small helper component for displaying info items consistently
function InfoItem({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p
          className={`font-semibold text-lg ${
            valueClassName ?? "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
