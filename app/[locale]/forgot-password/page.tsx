'use client';

import {ForgotPassword} from '@/components/features/auth/ForgotPassword';
import {useRouter} from 'next/navigation';
import {useLocale} from 'next-intl';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const locale = useLocale();

    return (
        <ForgotPassword onBackToLogin={() => router.push(`/${locale}/login`)}/>
    );
}
