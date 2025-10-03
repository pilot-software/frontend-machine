import React from 'react';
import {Card, CardContent} from '../ui/card';
import {AlertTriangle, CheckCircle2, Plus, UserPlus} from 'lucide-react';

interface PatientStatsProps {
  stats: {
    totalPatients?: number;
    newPatientsThisMonth?: number;
    criticalCases?: number;
    dischargedToday?: number;
  };
}

export function PatientStats({ stats }: PatientStatsProps) {
  const quickStats = [
    {
      label: "Total Patients",
      value: stats?.totalPatients?.toString() || "0",
      change: "+12%",
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      label: "New This Month",
      value: stats?.newPatientsThisMonth?.toString() || "0",
      change: "+23%",
      icon: Plus,
      color: "text-green-600",
    },
    {
      label: "Critical Cases",
      value: stats?.criticalCases?.toString() || "0",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "Discharged Today",
      value: stats?.dischargedToday?.toString() || "0",
      change: "+2%",
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg md:text-2xl font-semibold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
