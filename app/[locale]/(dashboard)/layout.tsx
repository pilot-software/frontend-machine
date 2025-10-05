'use client';

import {AuthProvider} from '@/components/providers/AuthContext';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {DashboardLayout} from '@/components/features/dashboard/DashboardLayout';
import {SessionManager} from '@/components/shared/utils/SessionManager';

export default function DashboardLayoutWrapper({
                                                   children,
                                               }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AuthGuard>
                <SessionManager>
                    <DashboardLayout>
                        {children}
                    </DashboardLayout>
                </SessionManager>
            </AuthGuard>
        </AuthProvider>
    );
}
