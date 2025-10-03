'use client';

import {AuthProvider} from '@/components/AuthContext';
import {ForgotPassword} from '@/components/ForgotPassword';
import {useRouter} from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <AuthProvider>
            <ForgotPassword onBackToLogin={() => router.push('/login')} />
        </AuthProvider>
    );
}
