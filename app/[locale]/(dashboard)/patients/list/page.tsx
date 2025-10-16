'use client';

import {PatientManagement} from '@/components/features/patients/PatientManagement';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function PatientsListPage() {
    return (
        <AuthGuard requiredPermissions={['PATIENTS_VIEW', 'PATIENTS_CREATE', 'PATIENTS_UPDATE']}>
            <PatientManagement/>
        </AuthGuard>
    );
}
