import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/components/providers/AuthContext";
import { AdminDashboardWidgets } from "./AdminDashboardWidgets";
import { DoctorDashboardWidgets } from "./DoctorDashboardWidgets";
import { PatientDashboardWidgets } from "./PatientDashboardWidgets";
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

  // Render role-specific dashboard widgets
  if (user.role === ROLES.ADMIN) {
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
