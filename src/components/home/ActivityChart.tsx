"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ActivityData } from "@/types";

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartColors = {
    commits: "#8b5cf6",
    prs: "#10b981",
    issues: "#f59e0b",
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-xl font-semibold">Activity Overview</h3>
      <Tabs defaultValue="line" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--muted-foreground))"
                strokeOpacity={0.25}
              />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "#ffffff" }}
                axisLine={{ stroke: "oklch(var(--muted-foreground))" }}
                tickLine={{ stroke: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "#ffffff" }}
                axisLine={{ stroke: "oklch(var(--muted-foreground))" }}
                tickLine={{ stroke: "oklch(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(var(--background))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ color: "oklch(var(--muted-foreground))" }} />
              <Line
                type="monotone"
                dataKey="commits"
                stroke={chartColors.commits}
                strokeWidth={2}
                strokeOpacity={0.9}
                dot={{ r: 3, fill: chartColors.commits, stroke: chartColors.commits }}
                activeDot={{ r: 5 }}
                name="Commits"
              />
              <Line
                type="monotone"
                dataKey="prs"
                stroke={chartColors.prs}
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={{ r: 3, fill: chartColors.prs, stroke: chartColors.prs }}
                activeDot={{ r: 5 }}
                name="Pull Requests"
              />
              <Line
                type="monotone"
                dataKey="issues"
                stroke={chartColors.issues}
                strokeWidth={2}
                strokeOpacity={0.55}
                dot={{ r: 3, fill: chartColors.issues, stroke: chartColors.issues }}
                activeDot={{ r: 5 }}
                name="Issues"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="bar">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--muted-foreground))"
                strokeOpacity={0.25}
              />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "#ffffff" }}
                axisLine={{ stroke: "oklch(var(--muted-foreground))" }}
                tickLine={{ stroke: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "#ffffff" }}
                axisLine={{ stroke: "oklch(var(--muted-foreground))" }}
                tickLine={{ stroke: "oklch(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(var(--background))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ color: "oklch(var(--muted-foreground))" }} />
              <Bar
                dataKey="commits"
                fill={chartColors.commits}
                fillOpacity={0.6}
                name="Commits"
                radius={4}
              />
              <Bar
                dataKey="prs"
                fill={chartColors.prs}
                fillOpacity={0.45}
                name="Pull Requests"
                radius={4}
              />
              <Bar
                dataKey="issues"
                fill={chartColors.issues}
                fillOpacity={0.35}
                name="Issues"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
