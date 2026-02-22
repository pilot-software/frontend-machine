import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/components/providers/AuthContext";
import { AdminDashboardWidgets } from "./AdminDashboardWidgets";
import { DoctorDashboardWidgets } from "./DoctorDashboardWidgets";
import { PatientDashboardWidgets } from "./PatientDashboardWidgets";
import { DashboardCustomizer } from "./DashboardCustomizer";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store";
import {
  openPatientModal,
  openAppointmentModal,
  openPrescriptionModal,
} from "@/lib/store/slices/modalSlice";
import { ROLES } from "@/lib/constants";

export function DashboardWidgets() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`dashboard-widgets-${user?.role}`);
    if (saved) {
      setEnabledWidgets(JSON.parse(saved));
    } else {
      setEnabledWidgets(['quickActions', 'bedOccupancy', 'emergencyRoom', 'staffAvailability', 'financial']);
    }
  }, [user?.role]);

  const handleWidgetUpdate = (widgets: any[]) => {
    const enabled = widgets.filter(w => w.enabled).map(w => w.id);
    setEnabledWidgets(enabled);
    localStorage.setItem(`dashboard-widgets-${user?.role}`, JSON.stringify(enabled));
  };

  if (!user) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleAddPatient = () => {
    router.push(`/${locale}/patients/add`);
  };

  const handleAddAppointment = () => {
    router.push(`/${locale}/appointments/add`);
  };

  const handleAddPrescription = () => {
    router.push(`/${locale}/prescriptions/add`);
  };

  const widgets = [
    { id: 'quickActions', label: 'quickActions', enabled: enabledWidgets.includes('quickActions'), category: 'actions' as const },
    { id: 'bedOccupancy', label: 'bedOccupancyRate', enabled: enabledWidgets.includes('bedOccupancy'), category: 'info' as const },
    { id: 'emergencyRoom', label: 'emergencyRoomStatus', enabled: enabledWidgets.includes('emergencyRoom'), category: 'info' as const },
    { id: 'staffAvailability', label: 'staffAvailability', enabled: enabledWidgets.includes('staffAvailability'), category: 'info' as const },
    { id: 'financial', label: 'financialOverview', enabled: enabledWidgets.includes('financial'), category: 'info' as const },
  ];

  // Render role-specific dashboard widgets
  if (user.role === ROLES.ADMIN) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <DashboardCustomizer widgets={widgets} onUpdate={handleWidgetUpdate} />
        </div>
        <AdminDashboardWidgets
          onNavigate={handleNavigate}
          onAddPatient={handleAddPatient}
          onAddAppointment={handleAddAppointment}
          onAddPrescription={handleAddPrescription}
          enabledWidgets={enabledWidgets}
        />
      </div>
    );
  }

  if (user.role === ROLES.DOCTOR) {
    return (
      <div className="mt-6">
        <DoctorDashboardWidgets />
      </div>
    );
  }

  if (user.role === ROLES.PATIENT) {
    return (
      <div className="mt-6">
        <PatientDashboardWidgets />
      </div>
    );
  }

  // Default for other roles (nurse, finance)
  return (
    <div className="mt-6">
      <AdminDashboardWidgets
        onNavigate={handleNavigate}
        onAddPatient={handleAddPatient}
        onAddAppointment={handleAddAppointment}
        onAddPrescription={handleAddPrescription}
      />
    </div>
  );
}
