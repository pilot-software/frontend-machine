'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/components/providers/AuthContext';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {Skeleton} from '@/components/ui/skeleton';
import {Card, CardContent, CardHeader} from '@/components/ui/card';

export default function PatientsPage() {
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
        if (user?.role === 'doctor' || user?.role === 'admin') {
            // Redirect to patient management table view
            router.push('/en/patients/list');
        }
    }, [user, router]);

    return (
        <AuthGuard requiredPermissions={['VIEW_PATIENT', 'CREATE_PATIENT', 'UPDATE_PATIENT']}>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-4 w-[300px] mt-2" />
                    </div>
                    <Skeleton className="h-10 w-[150px]" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-4 w-[300px] mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-3 w-[300px]" />
                                            <Skeleton className="h-3 w-[250px]" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthGuard>
    );
}
