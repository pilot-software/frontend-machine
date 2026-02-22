'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ResetPassword } from '@/components/features/auth/ResetPassword';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || '';

    return (
        <ResetPassword 
            token={token} 
            onSuccess={() => router.push('/login')} 
        />
    );
}
