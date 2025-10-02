'use client';

import { AppointmentSystem } from '@/components/AppointmentSystem';
import { AuthGuard } from '@/components/AuthGuard';

export default function AppointmentsPage() {
    return (
        <AuthGuard requiredPermissions={['APPOINTMENT_VIEW', 'APPOINTMENT_MANAGEMENT']}>
            <AppointmentSystem />
        </AuthGuard>
    );
}