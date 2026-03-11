"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PerformanceTrend } from "@/types/analytics";

interface PerformanceChartProps {
  data: PerformanceTrend[];
}

const formatNumber = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`;
  return value.toLocaleString("ko-KR");
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)} // MM-DD만 표시
          className="fill-muted-foreground"
        />
        <YAxis
          yAxisId="views"
          orientation="left"
          tick={{ fontSize: 11 }}
          tickFormatter={formatNumber}
          className="fill-muted-foreground"
        />
        <YAxis
          yAxisId="orders"
          orientation="right"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            const labels: Record<string, string> = {
              views: "조회수",
              likes: "좋아요",
              estimatedOrders: "추정 주문",
            };
            return [formatNumber(value), labels[name] || name];
          }}
          labelFormatter={(label) => `날짜: ${label}`}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          formatter={(value) => {
            const labels: Record<string, string> = {
              views: "조회수",
              likes: "좋아요",
              estimatedOrders: "추정 주문",
            };
            return labels[value] || value;
          }}
          wrapperStyle={{ fontSize: 12 }}
        />
        <Line
          yAxisId="views"
          type="monotone"
          dataKey="views"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="views"
          type="monotone"
          dataKey="likes"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="estimatedOrders"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
