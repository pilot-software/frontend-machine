'use client';

import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { DashboardWidgets } from '@/components/features/dashboard/DashboardWidgets';

export default function PatientsSlot() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardWidgets />
        </Suspense>
    );
}
