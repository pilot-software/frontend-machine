import React from 'react';
import { useAuth } from './AuthContext';
import { AdminDashboardWidgets } from './dashboard/AdminDashboardWidgets';
import { DoctorDashboardWidgets } from './dashboard/DoctorDashboardWidgets';
import { PatientDashboardWidgets } from './dashboard/PatientDashboardWidgets';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../lib/store';
import { openPatientModal, openAppointmentModal, openPrescriptionModal } from '../lib/store/slices/modalSlice';

export function DashboardWidgets() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!user) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleAddPatient = () => {
    dispatch(openPatientModal({ mode: 'add' }));
  };

  const handleAddAppointment = () => {
    dispatch(openAppointmentModal({ mode: 'add' }));
  };

  const handleAddPrescription = () => {
    dispatch(openPrescriptionModal({ mode: 'add' }));
  };

  // Render role-specific dashboard widgets
  if (user.role === 'admin') {
    return (
      <div className="mt-6">
        <AdminDashboardWidgets onNavigate={handleNavigate} onAddPatient={handleAddPatient} onAddAppointment={handleAddAppointment} onAddPrescription={handleAddPrescription} />
      </div>
    );
  }

  if (user.role === 'doctor') {
    return (
      <div className="mt-6">
        <DoctorDashboardWidgets />
      </div>
    );
  }

  if (user.role === 'patient') {
    return (
      <div className="mt-6">
        <PatientDashboardWidgets />
      </div>
    );
  }

  // Default for other roles (nurse, finance)
  return (
    <div className="mt-6">
      <AdminDashboardWidgets onNavigate={handleNavigate} onAddPatient={handleAddPatient} onAddAppointment={handleAddAppointment} onAddPrescription={handleAddPrescription} />
    </div>
  );
}
