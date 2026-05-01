'use client';

import { Suspense } from 'react';
import { AppointmentListSkeleton } from '@/components/skeletons/AppointmentSkeleton';
import { DashboardTabs } from '@/components/features/dashboard/DashboardTabs';

export default function AppointmentsSlot() {
    return (
        <Suspense fallback={<AppointmentListSkeleton />}>
            <DashboardTabs />
        </Suspense>
    );
}
