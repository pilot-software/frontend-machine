'use client';

import {AppointmentSystem} from '@/components/AppointmentSystem';
import {AuthGuard} from '@/components/AuthGuard';

export default function AppointmentsPage() {
    return (
        <AuthGuard requiredPermissions={['APPOINTMENTS_VIEW', 'APPOINTMENTS_CREATE', 'APPOINTMENTS_UPDATE']}>
            <AppointmentSystem/>
        </AuthGuard>
    );
}
