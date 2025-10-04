'use client';

import {AuthProvider} from '@/components/AuthContext';
import {LoginForm} from '@/components/LoginForm';
import {useRouter} from 'next/navigation';
import {useLocale} from 'next-intl';

export default function LoginPage() {
    const router = useRouter();
    const locale = useLocale();

    return (
        <AuthProvider key={locale}>
            <LoginForm onForgotPassword={() => router.push(`/${locale}/forgot-password`)}/>
        </AuthProvider>
    );
}
