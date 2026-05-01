import { NotificationPageSkeleton } from '@/components/skeletons/NotificationSkeleton';

export default function Loading() {
    return (
        <div className="p-6">
            <NotificationPageSkeleton />
        </div>
    );
}
