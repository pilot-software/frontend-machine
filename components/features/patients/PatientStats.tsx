import React from "react";
import { EnterpriseStatsCard } from "@/components/shared/EnterpriseStatsCard";
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <EnterpriseStatsCard
        title="Total Patients"
        value={stats?.totalPatients || 0}
        icon={UserPlus}
        variant="primary"
        trend={{ value: 12, label: 'vs last month' }}
      />
      <EnterpriseStatsCard
        title="New This Month"
        value={stats?.newPatientsThisMonth || 0}
        icon={Plus}
        variant="success"
        trend={{ value: 23, label: 'vs last month' }}
      />
      <EnterpriseStatsCard
        title="Critical Cases"
        value={stats?.criticalCases || 0}
        icon={AlertTriangle}
        variant="danger"
        trend={{ value: -8, label: 'vs last month', direction: 'down' }}
      />
      <EnterpriseStatsCard
        title="Discharged Today"
        value={stats?.dischargedToday || 0}
        icon={CheckCircle2}
        variant="success"
      />
    </div>
  );
}
