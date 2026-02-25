'use client';

import {LoginForm} from '@/components/features/auth/LoginForm';
import {useRouter} from 'next/navigation';
import {useLocale} from 'next-intl';

export default function LoginPage() {
    const router = useRouter();
    const locale = useLocale();

    return (
        <LoginForm onForgotPassword={() => router.push(`/${locale}/forgot-password`)}/>
    );
}
