import React from "react";
import { useTranslations } from "next-intl";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { AlertTriangle, CheckCircle2, Plus, UserPlus } from "lucide-react";

interface PatientStatsProps {
  stats: {
    totalPatients?: number;
    newPatientsThisMonth?: number;
    criticalCases?: number;
    dischargedToday?: number;
  };
}

export function PatientStats({ stats }: PatientStatsProps) {
  const t = useTranslations('common');
  return (
    <StatsCardGrid>
      <StatsCard
        title="Total Patients"
        value={stats?.totalPatients || 0}
        icon={UserPlus}
        color="text-blue-600"
        bgGradient="from-blue-500 to-blue-600"
        change="+12%"
        trend="up"
      />
      <StatsCard
        title="New This Month"
        value={stats?.newPatientsThisMonth || 0}
        icon={Plus}
        color="text-green-600"
        bgGradient="from-green-500 to-green-600"
        change="+23%"
        trend="up"
      />
      <StatsCard
        title="Critical Cases"
        value={stats?.criticalCases || 0}
        icon={AlertTriangle}
        color="text-red-600"
        bgGradient="from-red-500 to-red-600"
        change="-8%"
        trend="down"
      />
      <StatsCard
        title="Discharged Today"
        value={stats?.dischargedToday || 0}
        icon={CheckCircle2}
        color="text-emerald-600"
        bgGradient="from-emerald-500 to-emerald-600"
        change="+2%"
        trend="up"
      />
    </StatsCardGrid>
  );
}
