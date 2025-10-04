'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function SchedulePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Shift Schedule</h2>
                <p className="text-muted-foreground mt-1">Staff scheduling and shift management</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>Scheduling system is under development</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This feature will be available in an upcoming release.</p>
                </CardContent>
            </Card>
        </div>
    );
}
