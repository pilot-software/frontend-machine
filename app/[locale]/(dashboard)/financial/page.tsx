'use client';

import {FinancialManagement} from '@/components/FinancialManagement';
import {AuthGuard} from '@/components/AuthGuard';

export default function FinancialPage() {
    return (
        <AuthGuard
            requiredPermissions={['BILLING_VIEW_INVOICES', 'BILLING_CREATE_INVOICES', 'BILLING_PROCESS_PAYMENTS']}>
            <FinancialManagement/>
        </AuthGuard>
    );
}
