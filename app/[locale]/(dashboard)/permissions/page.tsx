'use client';

import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {PermissionManagement} from '@/components/features/permissions/PermissionManagement';

export default function PermissionsPage() {
    return (
        <AuthGuard requiredPermissions={['USERS_MANAGE_PERMISSIONS']}>
            <PermissionManagement />
        </AuthGuard>
    );
}
