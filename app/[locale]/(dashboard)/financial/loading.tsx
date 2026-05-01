import { FinancialStatsSkeleton } from '@/components/skeletons/FinancialSkeleton';

export default function Loading() {
    return (
        <div className="p-6">
            <FinancialStatsSkeleton />
        </div>
    );
}
