import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ icon: Icon, label, value, trend, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </div>
    </Card>
  );
}
