'use client';

import {AuthProvider} from '@/components/providers/AuthContext';
import {ForgotPassword} from '@/components/features/auth/ForgotPassword';
import {useRouter} from 'next/navigation';
import {ROUTES} from '@/lib/constants';

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <AuthProvider>
            <ForgotPassword onBackToLogin={() => router.push(ROUTES.LOGIN)}/>
        </AuthProvider>
    );
}
