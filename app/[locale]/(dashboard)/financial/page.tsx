'use client';

import {FinancialManagement} from '@/components/features/financial/FinancialManagement';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function FinancialPage() {
    return (
        <AuthGuard
            requiredPermissions={['VIEW_BILLING', 'CREATE_INVOICE', 'PROCESS_PAYMENT']}>
            <FinancialManagement/>
        </AuthGuard>
    );
}
