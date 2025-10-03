'use client';

import {PatientManagement} from '@/components/PatientManagement';
import {AuthGuard} from '@/components/AuthGuard';

export default function PatientsPage() {
    return (
        <AuthGuard requiredPermissions={['PATIENTS_VIEW', 'PATIENTS_CREATE', 'PATIENTS_UPDATE']}>
            <PatientManagement />
        </AuthGuard>
    );
}
