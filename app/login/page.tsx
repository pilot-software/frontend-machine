'use client';

import {AuthProvider} from '@/components/AuthContext';
import {LoginForm} from '@/components/LoginForm';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    return (
        <AuthProvider>
            <LoginForm onForgotPassword={() => router.push('/forgot-password')} />
        </AuthProvider>
    );
}
