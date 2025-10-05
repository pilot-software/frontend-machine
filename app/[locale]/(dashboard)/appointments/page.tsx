'use client';

import {AppointmentSystem} from '@/components/features/appointments/AppointmentSystem';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function AppointmentsPage() {
    return (
        <AuthGuard requiredPermissions={['APPOINTMENTS_VIEW', 'APPOINTMENTS_CREATE', 'APPOINTMENTS_UPDATE']}>
            <AppointmentSystem/>
        </AuthGuard>
    );
}
