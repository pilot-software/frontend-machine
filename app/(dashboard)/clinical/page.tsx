'use client';

import { ClinicalInterface } from '@/components/ClinicalInterface';
import { AuthGuard } from '@/components/AuthGuard';

export default function ClinicalPage() {
    return (
        <AuthGuard requiredPermissions={['MEDICAL_RECORDS_READ', 'MEDICAL_RECORDS_CREATE', 'MEDICAL_RECORDS_UPDATE']}>
            <ClinicalInterface />
        </AuthGuard>
    );
}