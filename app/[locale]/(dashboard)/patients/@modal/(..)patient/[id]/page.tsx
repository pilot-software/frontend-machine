'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function PatientModalIntercepted({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const locale = useLocale();

    return (
        <Dialog open onOpenChange={() => router.back()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-muted-foreground text-sm">
                    Loading patient information...
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Close</Button>
                    <Button
                        onClick={async () => {
                            const { id } = await params;
                            router.push(`/${locale}/patient/${id}`);
                        }}
                        className="flex items-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open Full Page
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
