import { AppointmentListSkeleton } from '@/components/skeletons/AppointmentSkeleton';

export default function Loading() {
    return (
        <div className="p-6">
            <AppointmentListSkeleton />
        </div>
    );
}
