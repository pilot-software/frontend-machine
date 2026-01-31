'use client';

import {AppointmentSystemModern} from '@/components/features/appointments/AppointmentSystemModern';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function AppointmentsPage() {
    return (
        <AuthGuard requiredPermissions={['VIEW_APPOINTMENT', 'CREATE_APPOINTMENT', 'UPDATE_APPOINTMENT']}>
            <AppointmentSystemModern/>
        </AuthGuard>
    );
}
