'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/components/providers/AuthContext';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';

export default function PatientsPage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (user?.role === 'doctor' || user?.role === 'admin') {
            // Redirect to patient management table view
            router.push('/en/patients/list');
        }
    }, [user, router]);

    return (
        <AuthGuard requiredPermissions={['PATIENTS_VIEW', 'PATIENTS_CREATE', 'PATIENTS_UPDATE']}>
            <div className="flex items-center justify-center p-8">
                <p>Loading...</p>
            </div>
        </AuthGuard>
    );
}
