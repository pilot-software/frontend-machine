'use client';

import { PatientManagement } from '@/components/PatientManagement';
import { AuthGuard } from '@/components/AuthGuard';

export default function PatientsPage() {
    return (
        <AuthGuard requiredPermissions={['PATIENT_VIEW', 'PATIENT_MANAGEMENT']}>
            <PatientManagement />
        </AuthGuard>
    );
}