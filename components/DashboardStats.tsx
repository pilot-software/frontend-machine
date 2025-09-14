import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, Users, Calendar, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  stats: any;
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {



  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="card-responsive">
              <div className="animate-pulse">
                <div className="h-3 sm:h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 sm:h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = stats?.data || stats || {};
  const dashboardCards = [
    {
      title: 'Total Patients',
      value: statsData?.totalPatients || 0,
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'New This Month',
      value: statsData?.newPatientsThisMonth || 0,
      icon: Activity,
      color: 'text-primary'
    },
    {
      title: "Today's Appointments",
      value: statsData?.todayAppointments || 0,
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(statsData?.revenue?.monthly || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {dashboardCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.color}`} />
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}