'use client';

import {AppointmentSystemModern} from '@/components/features/appointments/AppointmentSystemModern';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function AppointmentsPage() {
    return (
        <AuthGuard requiredPermissions={['APPOINTMENTS_VIEW', 'APPOINTMENTS_CREATE', 'APPOINTMENTS_UPDATE']}>
            <AppointmentSystemModern/>
        </AuthGuard>
    );
}
