

export interface DashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  todayAppointments: number;
  criticalCases: number;
  dischargedToday: number;
  revenue: {
    monthly: number;
    pendingPayments: number;
  };
}

export interface PatientStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  activePatients: number;
  patientsByGender: Record<string, number>;
  patientsByAgeGroup: Record<string, number>;
}

export interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  appointmentsByStatus: Record<string, number>;
}

export interface FinancialStats {
  totalRevenue: number;
  totalPaid: number;
  outstandingAmount: number;
  monthlyRevenue: Record<string, number>;
  revenueByPaymentMethod: Record<string, number>;
}

import { apiClient } from '../api';

export class DashboardService {
  async getDashboardStats(branchId?: string): Promise<DashboardStats> {
    return apiClient.getDashboardData(branchId);
  }
}

export const dashboardService = new DashboardService();