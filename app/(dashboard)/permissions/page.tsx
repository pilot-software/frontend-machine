'use client';

import { AuthGuard } from '@/components/AuthGuard';

export default function PermissionsPage() {
    return (
        <AuthGuard requiredPermissions={['USERS_MANAGE_PERMISSIONS']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Permission Management</h1>
                    <p className="text-muted-foreground">Manage user permissions and access control</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-2">User Permissions</h3>
                        <p className="text-sm text-muted-foreground">Manage individual user permissions</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-2">Role Management</h3>
                        <p className="text-sm text-muted-foreground">Configure role-based permissions</p>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h3 className="font-semibold mb-2">Permission Groups</h3>
                        <p className="text-sm text-muted-foreground">Create and manage permission groups</p>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}