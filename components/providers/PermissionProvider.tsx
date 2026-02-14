'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { permissionService, UserEffectivePermissionsResponse, PermissionGroup } from '@/lib/services/permission';
import { useAuth } from './AuthContext';

interface PermissionContextType {
  permissions: Set<string>;
  groups: PermissionGroup[];
  loading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
  branchPermissions: Record<string, string>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchPermissions, setBranchPermissions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserPermissions();
    } else {
      // Clear permissions when user is not authenticated
      setPermissions(new Set());
      setGroups([]);
      setBranchPermissions({});
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const loadUserPermissions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await permissionService.getUserEffectivePermissions(user.id);
      
      setPermissions(new Set(response.effectivePermissions));
      setGroups(response.groups);
      setBranchPermissions(response.branchPermissions || {});
    } catch (err) {
      console.error('Failed to load user permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
      setPermissions(new Set());
      setGroups([]);
      setBranchPermissions({});
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.has(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(p => permissions.has(p));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every(p => permissions.has(p));
  };

  const refreshPermissions = async (): Promise<void> => {
    await loadUserPermissions();
  };

  const value: PermissionContextType = {
    permissions,
    groups,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
    branchPermissions
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// Permission guard component
interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({ 
  permission, 
  permissions = [], 
  requireAll = false, 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Hook for common permission checks
export const usePermissionChecks = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return {
    // Patient Management
    canViewPatients: () => hasAnyPermission(['VIEW_PATIENTS', 'VIEW_PATIENT']),
    canCreatePatients: () => hasPermission('CREATE_PATIENT'),
    canUpdatePatients: () => hasPermission('UPDATE_PATIENT'),
    canDeletePatients: () => hasPermission('DELETE_PATIENT'),

    // Appointments
    canViewAppointments: () => hasAnyPermission(['VIEW_APPOINTMENTS', 'VIEW_APPOINTMENT']),
    canCreateAppointments: () => hasPermission('CREATE_APPOINTMENT'),
    canUpdateAppointments: () => hasPermission('UPDATE_APPOINTMENT'),
    canCancelAppointments: () => hasPermission('CANCEL_APPOINTMENT'),

    // Prescriptions
    canViewPrescriptions: () => hasAnyPermission(['VIEW_PRESCRIPTIONS', 'VIEW_PRESCRIPTION']),
    canCreatePrescriptions: () => hasPermission('CREATE_PRESCRIPTION'),
    canUpdatePrescriptions: () => hasPermission('UPDATE_PRESCRIPTION'),

    // Lab Results
    canViewLabResults: () => hasPermission('VIEW_LAB_RESULTS'),
    canCreateLabOrders: () => hasPermission('CREATE_LAB_ORDER'),
    canUpdateLabResults: () => hasPermission('UPDATE_LAB_RESULTS'),

    // Billing
    canViewBilling: () => hasPermission('VIEW_BILLING'),
    canCreateInvoices: () => hasPermission('CREATE_INVOICE'),
    canProcessPayments: () => hasPermission('PROCESS_PAYMENT'),

    // User Management
    canViewUsers: () => hasPermission('VIEW_USER'),
    canCreateUsers: () => hasPermission('CREATE_USER'),
    canUpdateUsers: () => hasPermission('UPDATE_USER'),
    canDeactivateUsers: () => hasPermission('DEACTIVATE_USER'),

    // System
    canViewAnalytics: () => hasPermission('VIEW_ANALYTICS'),
    canViewSecurityLogs: () => hasPermission('VIEW_SECURITY_LOGS'),
    canManagePermissions: () => hasPermission('MANAGE_PERMISSIONS'),
    canManageSettings: () => hasPermission('MANAGE_SETTINGS'),

    // Medical Records
    canViewMedicalRecords: () => hasPermission('VIEW_MEDICAL_RECORD'),
    canCreateMedicalRecords: () => hasPermission('CREATE_MEDICAL_RECORD'),
    canUpdateMedicalRecords: () => hasPermission('UPDATE_MEDICAL_RECORD'),
  };
};