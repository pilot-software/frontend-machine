import React from "react";
import { useTranslations } from "next-intl";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { Card, CardContent } from "@/components/ui/card";

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  bgGradient?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "text-blue-600",
  bgGradient = "from-blue-500 to-blue-600",
  change,
  trend = "neutral",
  trendValue,
}: StatsCardProps) {
  const displayChange = change || trendValue;
  const t = useTranslations("common");
  const numericValue =
    typeof value === "number"
      ? value
      : parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
  const animatedValue = useCounterAnimation(numericValue, 1200);

  const displayValue =
    typeof value === "number"
      ? animatedValue.toLocaleString()
      : String(value).replace(/[0-9,]+/, animatedValue.toLocaleString());

  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;

  const getHoverColor = () => {
    const colorMap: Record<string, string> = {
      blue: "rgba(59, 130, 246, 0.08)",
      green: "rgba(16, 185, 129, 0.08)",
      emerald: "rgba(16, 185, 129, 0.08)",
      red: "rgba(239, 68, 68, 0.08)",
      orange: "rgba(249, 115, 22, 0.08)",
      purple: "rgba(168, 85, 247, 0.08)",
    };
    const colorKey = Object.keys(colorMap).find((key) =>
      bgGradient.includes(key)
    );
    return colorKey ? colorMap[colorKey] : "rgba(59, 130, 246, 0.08)";
  };

  return (
    <div className="group relative rounded-lg sm:rounded-xl bg-linear-to-br from-card to-card/50 p-3 sm:p-4 md:p-5 shadow-none hover:shadow-xl transition-all duration-300 border border-border/50 overflow-hidden hover:-translate-y-1 hover:scale-[1.01]">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${getHoverColor()} 0%, transparent 70%)`,
        }}
      />
      <div
        className={`absolute inset-0 bg-linear-to-br ${bgGradient} opacity-5`}
      />
      <div className="relative">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2 truncate">
              {displayValue}
            </h3>
            {displayChange && (
              <div className="flex items-center mt-1 sm:mt-2 text-xs">
                {TrendIcon && (
                  <TrendIcon
                    className={`h-3 w-3 mr-1 shrink-0 ${
                      trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                )}
                <span
                  className={
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }
                >
                  {displayChange}
                </span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">
                  vs yesterday
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-linear-to-br ${bgGradient} shrink-0`}
          >
            <Icon
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {children}
    </div>
  );
}
