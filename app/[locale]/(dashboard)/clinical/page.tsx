'use client';

import {ClinicalInterface} from '@/components/features/clinical/ClinicalInterface';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function ClinicalPage() {
    return (
        <AuthGuard requiredPermissions={['VIEW_MEDICAL_RECORD', 'CREATE_MEDICAL_RECORD', 'UPDATE_MEDICAL_RECORD']}>
            <ClinicalInterface/>
        </AuthGuard>
    );
}
