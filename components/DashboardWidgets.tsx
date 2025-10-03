import React from 'react';
import { useAuth } from './AuthContext';
import { AdminDashboardWidgets } from './dashboard/AdminDashboardWidgets';
import { DoctorDashboardWidgets } from './dashboard/DoctorDashboardWidgets';
import { PatientDashboardWidgets } from './dashboard/PatientDashboardWidgets';

export function DashboardWidgets() {
  const { user } = useAuth();

  if (!user) return null;

  // Render role-specific dashboard widgets
  if (user.role === 'admin') {
    return (
      <div className="mt-6">
        <AdminDashboardWidgets />
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
      <AdminDashboardWidgets />
    </div>
  );
}
