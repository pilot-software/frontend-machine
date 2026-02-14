import { usePermissions as usePermissionsContext, usePermissionChecks } from "@/components/providers/PermissionProvider";

export const usePermissions = () => {
  const context = usePermissionsContext();
  const checks = usePermissionChecks();

  return {
    ...context,
    ...checks,
    // Legacy compatibility methods
    canViewPatients: checks.canViewPatients,
    canManagePatients: () => context.hasAnyPermission(['CREATE_PATIENT', 'UPDATE_PATIENT', 'DELETE_PATIENT']),
    canViewAppointments: checks.canViewAppointments,
    canManageAppointments: () => context.hasAnyPermission(['CREATE_APPOINTMENT', 'UPDATE_APPOINTMENT', 'CANCEL_APPOINTMENT']),
    canViewClinicalRecords: () => context.hasPermission('VIEW_MEDICAL_RECORD'),
    canViewPrescriptions: checks.canViewPrescriptions,
    canManagePrescriptions: () => context.hasAnyPermission(['CREATE_PRESCRIPTION', 'UPDATE_PRESCRIPTION']),
    canViewFinancials: () => context.hasAnyPermission(['VIEW_BILLING', 'VIEW_ANALYTICS']),
    canManageBilling: () => context.hasAnyPermission(['CREATE_INVOICE', 'PROCESS_PAYMENT']),
    canViewAnalytics: checks.canViewAnalytics,
    canViewReports: () => context.hasPermission('VIEW_ANALYTICS'),
    canManageUsers: () => context.hasAnyPermission(['CREATE_USER', 'UPDATE_USER', 'DEACTIVATE_USER']),
    canViewSecurityLogs: checks.canViewSecurityLogs,
  };
};
