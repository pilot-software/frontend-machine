'use client';

import React, {useEffect} from 'react';
import {AuthProvider, useAuth} from '@/components/AuthContext';
import {useRouter} from 'next/navigation';

function AuthFlowManager() {
    const {user, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
        }
    }, [user, isLoading, router]);

    return null;
}

export default function HomePage() {
    return (
        <AuthProvider>
            <AuthFlowManager/>
        </AuthProvider>
    );
}
