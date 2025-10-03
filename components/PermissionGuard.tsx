'use client';

import {usePermissions} from '@/lib/hooks/usePermissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions, otherwise ANY
}

export function PermissionGuard({
  children,
  permissions = [],
  requireAll = false
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (permissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : null;
}
