'use client';

import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {DashboardLayout} from '@/components/features/dashboard/DashboardLayout';
import {SessionManager} from '@/components/shared/utils/SessionManager';
import {ScrollToTop} from '@/components/ui/scroll-to-top';

export default function DashboardLayoutWrapper({
                                                   children,
                                               }: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SessionManager>
                <DashboardLayout>
                    {children}
                    <ScrollToTop />
                </DashboardLayout>
            </SessionManager>
        </AuthGuard>
    );
}
