import React from "react";
import { useTranslations } from "next-intl";
import { LucideIcon, TrendingUp } from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

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

  const borderGradient = bgGradient;
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer group`}
    >
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-[0.07] group-hover:opacity-[0.15] transition-all duration-500`}
      />

      {/* Floating orbs */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 ${color
          .replace("text-", "bg-")
          .replace(
            "-600",
            "-500/20"
          )} rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-150 transition-all duration-500`}
      />
      <div
        className={`absolute -bottom-8 -left-8 w-24 h-24 ${color
          .replace("text-", "bg-")
          .replace(
            "-600",
            "-400/10"
          )} rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-150 transition-all duration-500`}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative">
            <Icon
              className={`${color} group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}
              strokeWidth={2.5}
              style={{ width: "24px", height: "24px" }}
            />
          </div>
          {displayChange && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                trend === "up"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : trend === "down"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {trend !== "neutral" && (
                <TrendingUp
                  className={`h-3 w-3 ${trend === "down" ? "rotate-180" : ""}`}
                />
              )}
              <span className="text-xs font-semibold">{displayChange}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
            {displayValue}
          </p>
        </div>
      </div>

      {/* Animated border sweep left to right */}
      <div className="absolute inset-0 rounded-xl pointer-events-none">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:[animation:border-sweep_1.5s_ease-out_forwards]"
          style={{
            borderImage: `linear-gradient(90deg, transparent 0%, ${
              color.includes("blue")
                ? "#3b82f6"
                : color.includes("orange")
                ? "#f97316"
                : color.includes("green")
                ? "#10b981"
                : color.includes("purple")
                ? "#a855f7"
                : "#3b82f6"
            } 50%, transparent 100%) 1`,
            borderWidth: "2px",
            borderStyle: "solid",
            borderRadius: "0.75rem",
            width: "40%",
            height: "100%",
            position: "absolute",
            left: "-40%",
            top: 0,
          }}
        />
      </div>

      {/* Accent border */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </div>
  );
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {children}
    </div>
  );
}
