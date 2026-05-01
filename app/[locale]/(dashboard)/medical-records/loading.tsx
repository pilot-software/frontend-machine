import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function Loading() {
    return (
        <div className="p-6">
            <DashboardSkeleton />
        </div>
    );
}
