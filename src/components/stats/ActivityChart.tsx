"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityData {
  month: string;
  commits: number;
  prs: number;
  issues: number;
}

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

  const tickColor = isDark ? "#ffffff" : "#000000";
  const gridStroke = isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.15)";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="commits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="prs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="issues" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={1} />
          <XAxis
            dataKey="month"
            className="text-xs"
            tickLine={false}
            axisLine={false}
            tick={{ fill: tickColor }}
          />
          <YAxis className="text-xs" tickLine={false} axisLine={false} tick={{ fill: tickColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
              border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
              borderRadius: "8px",
              color: isDark ? "#ffffff" : "#000000",
            }}
          />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#commits)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="prs"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#prs)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="issues"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#issues)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
          <span className="text-muted-foreground">Commits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-muted-foreground">Pull Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-muted-foreground">Issues</span>
        </div>
      </div>
    </Card>
  );
}
