import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
}

interface ClinicalStatsProps {
  stats: StatItem[];
}

export const ClinicalStats = React.memo<ClinicalStatsProps>(({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p
                    className={`text-sm mt-1 ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : stat.change === "0"
                        ? "text-slate-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change !== "0" && stat.change.startsWith("+") && "+"}
                    {stat.change} today
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

ClinicalStats.displayName = "ClinicalStats";
