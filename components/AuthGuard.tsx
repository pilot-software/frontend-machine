'use client';

import {useAuth} from './AuthContext';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredPermissions?: string[];
}

export function AuthGuard({children, requiredPermissions}: AuthGuardProps) {
    const {user, isLoading, hasAnyPermission} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && requiredPermissions && !hasAnyPermission(requiredPermissions)) {
            console.log('Access denied: insufficient permissions');
            router.push('/dashboard');
            return;
        }
    }, [user, isLoading, requiredPermissions, hasAnyPermission, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
