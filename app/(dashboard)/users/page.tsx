'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
                <p className="text-muted-foreground mt-1">Manage system users and permissions</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>System Users</CardTitle>
                    <CardDescription>
                        User management interface will be implemented here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">User management functionality coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}