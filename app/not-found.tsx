'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
            <h1 className="text-3xl font-bold">404 — Page Not Found</h1>
            <p className="text-muted-foreground max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
                <Button onClick={() => router.push('/en/dashboard')}>Go to Dashboard</Button>
            </div>
        </div>
    );
}
