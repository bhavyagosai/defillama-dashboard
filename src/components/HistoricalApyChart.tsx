"use client";

import type { ChartDataPoint } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

// This function processes the raw daily data into monthly data points
const processChartData = (rawData: ChartDataPoint[]) => {
  if (!rawData || rawData.length === 0) return [];

  // using map here to easily check keys when needed
  const monthlyData = new Map<string, { fullDate: Date; apy: number }>();

  // cutoff point to compute from last 12 months only
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Iterate through the raw data to find the first entry of each month
  for (const point of rawData) {
    const pointDate = new Date(point.timestamp);

    // Skip data older than one year
    if (pointDate < oneYearAgo) continue;

    const monthKey = `${pointDate.getFullYear()}-${pointDate.getMonth()}`;

    // only store first of each month
    // deduplication logic
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        fullDate: pointDate, // Store the full date for sorting
        apy: Number(point.apy.toFixed(2)),
      });
    }
  }

  // Convert map to an array and explicitly sort by date to guarantee order
  const sortedData = Array.from(monthlyData.values()).sort(
    (a, b) => a.fullDate.getTime() - b.fullDate.getTime()
  );

  // Format the data for the chart's display needs
  return sortedData.map((point) => ({
    date: point.fullDate.toLocaleString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    apy: point.apy,
  }));
};

export function HistoricalApyChart({ rawData }: { rawData: ChartDataPoint[] }) {
  // useMemo ensures the expensive data processing only runs when rawData changes
  const chartData = useMemo(() => processChartData(rawData), [rawData]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical APY (Last 12 Months)</CardTitle>
          <CardDescription>
            No historical data available for this period.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical APY (Last 12 Months)</CardTitle>
        <CardDescription>
          Showing the APY from the first available day of each month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="fillApy" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, "APY"]}
              />
              <Area
                type="monotone"
                dataKey="apy"
                stroke="var(--primary)"
                fill="url(#fillApy)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
