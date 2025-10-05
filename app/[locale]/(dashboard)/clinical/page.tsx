'use client';

import {ClinicalInterface} from '@/components/features/clinical/ClinicalInterface';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function ClinicalPage() {
    return (
        <AuthGuard requiredPermissions={['MEDICAL_RECORDS_READ', 'MEDICAL_RECORDS_CREATE', 'MEDICAL_RECORDS_UPDATE']}>
            <ClinicalInterface/>
        </AuthGuard>
    );
}
