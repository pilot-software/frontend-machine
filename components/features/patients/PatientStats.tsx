import React from 'react';
import {StatsCard, StatsCardGrid} from '@/components/ui/stats-card';
import {AlertTriangle, CheckCircle2, Plus, UserPlus} from 'lucide-react';

interface PatientStatsProps {
    stats: {
        totalPatients?: number;
        newPatientsThisMonth?: number;
        criticalCases?: number;
        dischargedToday?: number;
    };
}

export function PatientStats({stats}: PatientStatsProps) {
    return (
        <StatsCardGrid>
            <StatsCard
                title="Total Patients"
                value={stats?.totalPatients?.toString() || "0"}
                icon={UserPlus}
                color="text-blue-600"
                bgGradient="from-blue-500/10 to-blue-600/5"
                change="+12%"
                trend="up"
            />
            <StatsCard
                title="New This Month"
                value={stats?.newPatientsThisMonth?.toString() || "0"}
                icon={Plus}
                color="text-green-600"
                bgGradient="from-green-500/10 to-green-600/5"
                change="+23%"
                trend="up"
            />
            <StatsCard
                title="Critical Cases"
                value={stats?.criticalCases?.toString() || "0"}
                icon={AlertTriangle}
                color="text-red-600"
                bgGradient="from-red-500/10 to-red-600/5"
                change="-8%"
                trend="down"
            />
            <StatsCard
                title="Discharged Today"
                value={stats?.dischargedToday?.toString() || "0"}
                icon={CheckCircle2}
                color="text-emerald-600"
                bgGradient="from-emerald-500/10 to-emerald-600/5"
                change="+2%"
                trend="up"
            />
        </StatsCardGrid>
    );
}
