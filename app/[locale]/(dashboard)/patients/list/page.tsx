'use client';

import {PatientManagement} from '@/components/features/patients/PatientManagement';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function PatientsListPage() {
    return (
        <AuthGuard requiredPermissions={['VIEW_PATIENT', 'CREATE_PATIENT', 'UPDATE_PATIENT']}>
            <PatientManagement/>
        </AuthGuard>
    );
}
