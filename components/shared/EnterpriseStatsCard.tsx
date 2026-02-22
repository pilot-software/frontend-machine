import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnterpriseStatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    bg: 'bg-card',
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  primary: {
    bg: 'bg-card',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-card',
    iconBg: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-card',
    iconBg: 'bg-yellow-50 dark:bg-yellow-950',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  danger: {
    bg: 'bg-card',
    iconBg: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-600 dark:text-red-400',
  },
};

export function EnterpriseStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
  className,
}: EnterpriseStatsCardProps) {
  const styles = variantStyles[variant];
  
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      styles.bg,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">
                {value}
              </h3>
              {trend && TrendIcon && (
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  trend.value > 0 && 'text-green-600 dark:text-green-400',
                  trend.value < 0 && 'text-red-600 dark:text-red-400',
                  trend.value === 0 && 'text-muted-foreground'
                )}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            {(description || trend?.label) && (
              <p className="text-xs text-muted-foreground mt-2">
                {trend?.label || description}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
              styles.iconBg
            )}>
              <Icon className={cn('w-6 h-6', styles.iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
