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
  const t = useTranslations('common');
  const numericValue =
    typeof value === "number"
      ? value
      : parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
  const animatedValue = useCounterAnimation(numericValue, 1200);

  const displayValue =
    typeof value === "number"
      ? animatedValue.toLocaleString()
      : String(value).replace(/[0-9,]+/, animatedValue.toLocaleString());

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;

  return (
    <div className="group relative rounded-xl bg-gradient-to-br from-card to-card/50 p-5 shadow-none hover:shadow-2xl transition-all duration-300 border border-border/50 overflow-hidden hover:-translate-y-2 hover:scale-[1.02]">
      <div className={`absolute inset-0 bg-gradient-radial from-${color.replace('text-', '').replace('-600', '-500/10')} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{background: `radial-gradient(circle at 20% 30%, ${color.includes('blue') ? 'rgba(59, 130, 246, 0.15)' : color.includes('green') ? 'rgba(16, 185, 129, 0.15)' : color.includes('orange') ? 'rgba(249, 115, 22, 0.15)' : color.includes('purple') ? 'rgba(168, 85, 247, 0.15)' : 'rgba(59, 130, 246, 0.15)'} 0%, transparent 70%)`}} />
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-5`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{displayValue}</h3>
            {displayChange && (
              <div className="flex items-center mt-2 text-xs">
                {TrendIcon && <TrendIcon className={`h-3 w-3 mr-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`} />}
                <span className={trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}>
                  {displayChange}
                </span>
                <span className="text-muted-foreground ml-1">vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient}`}>
            <Icon className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      {children}
    </div>
  );
}
