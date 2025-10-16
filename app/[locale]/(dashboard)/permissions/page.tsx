'use client';

import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function PermissionsPage() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/permissions/overview');
    }, [router]);

    return null;
}
