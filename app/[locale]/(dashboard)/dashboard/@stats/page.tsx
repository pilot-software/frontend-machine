'use client';

import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { DashboardStats } from '@/components/features/dashboard/DashboardStats';

export default function StatsSlot() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardStats />
        </Suspense>
    );
}
