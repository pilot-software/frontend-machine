import { api } from '../api';
import { apiClient } from '../api';

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
    averageAge: number;
    topDiagnoses?: { diagnosis: string; count: number }[];
}

export interface AppointmentStats {
    totalAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    appointmentsByStatus: Record<string, number>;
    appointmentsByDepartment?: Record<string, number>;
    averageWaitTime?: number;
}

export interface FinancialStats {
    totalRevenue: number;
    totalPaid: number;
    outstandingAmount: number;
    monthlyRevenue: Record<string, number>;
    revenueByPaymentMethod: Record<string, number>;
    revenueByDepartment?: Record<string, number>;
    averageTransactionValue?: number;
}

export interface ClinicalStats {
    totalAdmissions: number;
    currentInpatients: number;
    dischargedToday: number;
    criticalPatients: number;
    averageLengthOfStay: number;
    bedOccupancyRate: number;
    labTestsToday: number;
    prescriptionsToday: number;
}

export interface AnalyticsData {
    patientGrowth: { month: string; count: number }[];
    revenueGrowth: { month: string; amount: number }[];
    appointmentTrends: { date: string; count: number }[];
    departmentPerformance: { department: string; patients: number; revenue: number }[];
}

export class DashboardService {
    async getDashboardStats(branchId?: string): Promise<DashboardStats> {
        return apiClient.getDashboardData(branchId);
    }

    async getPatientStats(branchId?: string): Promise<PatientStats> {
        return apiClient.getPatientStats(branchId);
    }

    async getFinancialStats(branchId?: string): Promise<FinancialStats> {
        return apiClient.getFinancialStats(branchId);
    }

    async getClinicalStats(branchId?: string): Promise<ClinicalStats> {
        return apiClient.getClinicalStats(branchId);
    }

    async getAppointmentStats(branchId?: string): Promise<AppointmentStats> {
        return apiClient.getAppointmentStats(branchId);
    }

    async getAnalytics(branchId?: string): Promise<AnalyticsData> {
        return apiClient.getAnalytics(branchId);
    }

    async getRealtimeStats(branchId?: string): Promise<{
        activeAppointments: number;
        waitingPatients: number;
        availableDoctors: number;
        emergencyCases: number;
    }> {
        try {
            return await api.get(`/api/ops/dashboard/realtime${branchId ? `?branchId=${branchId}` : ''}`);
        } catch (error) {
            return {
                activeAppointments: 0,
                waitingPatients: 0,
                availableDoctors: 0,
                emergencyCases: 0
            };
        }
    }

    async getTopPerformers(branchId?: string, metric: 'revenue' | 'patients' | 'appointments' = 'patients'): Promise<{
        doctors: { id: string; name: string; value: number }[];
        departments: { id: string; name: string; value: number }[];
    }> {
        try {
            return await api.get(`/api/ops/dashboard/top-performers?metric=${metric}${branchId ? `&branchId=${branchId}` : ''}`);
        } catch (error) {
            return { doctors: [], departments: [] };
        }
    }

    async getAlerts(branchId?: string): Promise<{
        type: 'critical' | 'warning' | 'info';
        message: string;
        timestamp: string;
    }[]> {
        try {
            return await api.get(`/api/ops/dashboard/alerts${branchId ? `?branchId=${branchId}` : ''}`);
        } catch (error) {
            return [];
        }
    }

    async exportDashboardData(branchId?: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
        const response = await fetch(
            `${this.getBaseUrl()}/api/ops/dashboard/export?format=${format}${branchId ? `&branchId=${branchId}` : ''}`,
            {
                headers: this.getHeaders()
            }
        );
        if (!response.ok) throw new Error('Export failed');
        return response.blob();
    }

    private getBaseUrl(): string {
        if (typeof window === 'undefined') return 'http://localhost:8080';
        return process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
    }

    private getHeaders(): Record<string, string> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const user = typeof window !== 'undefined' ? localStorage.getItem('healthcare_user') : null;
        const userData = user ? JSON.parse(user) : null;
        const organizationId = userData?.organizationId;

        return {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(organizationId && { 'X-Organization-ID': organizationId })
        };
    }
}

export const dashboardService = new DashboardService();
