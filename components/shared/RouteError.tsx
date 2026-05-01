'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface RouteErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export function RouteError({ error, reset }: RouteErrorProps) {
    const router = useRouter();

    useEffect(() => {
        console.error('[RouteError]', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground max-w-md text-sm">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
                <Button onClick={reset}>Try Again</Button>
            </div>
        </div>
    );
}
