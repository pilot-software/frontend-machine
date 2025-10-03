import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ title, value, icon: Icon, color, bgGradient, change, trend = 'neutral' }: StatsCardProps) {
  return (
    <div className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group border-0 bg-card/80 backdrop-blur-sm rounded-lg`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-40 group-hover:opacity-60 transition-all duration-300`} />
      
      {/* Floating orb effect */}
      <div className={`absolute -top-2 -right-2 w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all duration-300`} />
      
      <div className="flex flex-row items-start justify-between space-y-0 pb-1.5 px-3 pt-3 relative z-10">
        <div className="flex-1">
          <div className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 mb-1.5">
            {title}
          </div>
          <div className="flex items-center space-x-1.5">
            {trend === 'up' && change && (
              <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                <TrendingUp className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">{change}</span>
              </div>
            )}
            {trend === 'down' && change && (
              <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">
                <TrendingUp className="h-2.5 w-2.5 text-red-600 dark:text-red-400 rotate-180" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">{change}</span>
              </div>
            )}
            {trend === 'neutral' && change && (
              <div className="bg-muted px-1.5 py-0.5 rounded-full">
                <span className="text-xs font-semibold text-muted-foreground">{change}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${color} group-hover:scale-110 transition-all duration-300 relative z-10`}/>
          <div className="text-lg font-bold group-hover:scale-105 transition-transform duration-300">
            {value}
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
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
