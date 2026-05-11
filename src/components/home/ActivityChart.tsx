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
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: "currentColor" }} />
              <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Commits"
              />
              <Line
                type="monotone"
                dataKey="prs"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Pull Requests"
              />
              <Line
                type="monotone"
                dataKey="issues"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Issues"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="bar">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: "currentColor" }} />
              <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Bar dataKey="commits" fill="hsl(var(--primary))" name="Commits" />
              <Bar dataKey="prs" fill="hsl(var(--chart-2))" name="Pull Requests" />
              <Bar dataKey="issues" fill="hsl(var(--chart-3))" name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
