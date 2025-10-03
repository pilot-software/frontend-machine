import {useAuth} from '@/components/AuthContext';

export const usePermissions = () => {
    const {permissions, hasPermission, hasAnyPermission} = useAuth();

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        // Common permission checks
        canViewPatients: () => hasAnyPermission(['PATIENT_VIEW', 'PATIENT_MANAGEMENT']),
        canManagePatients: () => hasPermission('PATIENT_MANAGEMENT'),
        canViewAppointments: () => hasAnyPermission(['APPOINTMENT_VIEW', 'APPOINTMENT_MANAGEMENT']),
        canManageAppointments: () => hasPermission('APPOINTMENT_MANAGEMENT'),
        canViewClinicalRecords: () => hasPermission('CLINICAL_RECORDS'),
        canViewPrescriptions: () => hasAnyPermission(['PRESCRIPTION_VIEW', 'PRESCRIPTION_MANAGEMENT']),
        canManagePrescriptions: () => hasPermission('PRESCRIPTION_MANAGEMENT'),
        canViewFinancials: () => hasAnyPermission(['FINANCIAL_REPORTS', 'BILLING_MANAGEMENT']),
        canManageBilling: () => hasPermission('BILLING_MANAGEMENT'),
        canViewAnalytics: () => hasPermission('ANALYTICS_VIEW'),
        canViewReports: () => hasPermission('REPORTS_VIEW'),
        canManageUsers: () => hasPermission('USER_MANAGEMENT'),
        canViewSecurityLogs: () => hasPermission('SECURITY_LOGS'),
    };
};
