"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
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
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const chartColors = {
    commits: "#8b5cf6",
    prs: "#10b981",
    issues: "#f59e0b",
  };

  const tickColor = isDark ? "#ffffff" : "#000000";
  const gridStroke = isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.15)";

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
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={1} />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: tickColor }}
                axisLine={{ stroke: gridStroke }}
                tickLine={{ stroke: gridStroke }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: tickColor }}
                axisLine={{ stroke: gridStroke }}
                tickLine={{ stroke: gridStroke }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                  border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
              <Legend wrapperStyle={{ color: tickColor }} />
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
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={1} />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: tickColor }}
                axisLine={{ stroke: gridStroke }}
                tickLine={{ stroke: gridStroke }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: tickColor }}
                axisLine={{ stroke: gridStroke }}
                tickLine={{ stroke: gridStroke }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                  border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
              <Legend wrapperStyle={{ color: tickColor }} />
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
