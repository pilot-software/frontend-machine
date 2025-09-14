import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Activity, Calendar, DollarSign, PillBottle, Stethoscope, Users } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useFeatures, useText } from '@/lib/useFeatures';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function DashboardTabs({ activeTab, onTabChange, children }: DashboardTabsProps) {
  const { user } = useAuth();
  const features = useFeatures();
  const text = useText();

  const getAvailableTabs = () => {
    if (user?.role === "patient") {
      const tabs = [];
      if (features.clinicalInterface)
        tabs.push({
          value: "clinical",
          label: "My Health Records",
          icon: Stethoscope,
        });
      if (features.appointmentSystem)
        tabs.push({
          value: "appointments",
          label: "My Appointments",
          icon: Calendar,
        });
      if (features.prescriptionSystem)
        tabs.push({
          value: "prescriptions",
          label: "My Prescriptions",
          icon: PillBottle,
        });
      return tabs;
    }

    if (user?.role === "doctor") {
      const tabs = [
        {
          value: "dashboard",
          label: features.wardManagement ? "My Patients" : "Patients",
          icon: Activity,
        },
      ];
      if (features.appointmentSystem)
        tabs.push({
          value: "appointments",
          label: "Appointments",
          icon: Calendar,
        });
      if (features.clinicalInterface)
        tabs.push({ value: "clinical", label: "Clinical", icon: Stethoscope });
      if (features.prescriptionSystem)
        tabs.push({
          value: "prescriptions",
          label: "Prescriptions",
          icon: PillBottle,
        });
      return tabs;
    }

    const baseTabs = [
      { value: "dashboard", label: text.systemName, icon: Activity },
    ];

    if (
      features.patientManagement &&
      (user?.role === "admin" || features.roles.nurse)
    ) {
      baseTabs.push({
        value: "patients",
        label: "Patient Management",
        icon: Users,
      });
    }

    if (features.appointmentSystem)
      baseTabs.push({
        value: "appointments",
        label: "Appointments",
        icon: Calendar,
      });
    if (features.clinicalInterface)
      baseTabs.push({
        value: "clinical",
        label: "Clinical",
        icon: Stethoscope,
      });
    if (features.prescriptionSystem)
      baseTabs.push({
        value: "prescriptions",
        label: "Prescriptions",
        icon: PillBottle,
      });

    if (
      features.financialManagement &&
      (user?.role === "admin" || features.roles.finance)
    ) {
      baseTabs.push({
        value: "financial",
        label: "Financial",
        icon: DollarSign,
      });
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="inline-flex h-10 min-w-full w-max">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 whitespace-nowrap"
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}