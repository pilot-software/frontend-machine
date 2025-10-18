'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {ArrowRight, Building, Eye, FileText, Settings, Shield, Users, UserCog, Layers, Building2} from 'lucide-react';
import {StatsCard} from '@/components/ui/stats-card';

export default function PermissionsOverviewPage() {
    const router = useRouter();

    const permissionModules = [
        {
            title: 'Role Permissions',
            description: 'Manage permissions for each user role',
            icon: <Shield className="h-8 w-8 text-blue-600"/>,
            path: '/permissions/roles',
            stats: '5 Roles',
            color: 'bg-blue-50 border-blue-200'
        },
        {
            title: 'Permission Groups',
            description: 'Create and manage permission groups',
            icon: <Users className="h-8 w-8 text-green-600"/>,
            path: '/permissions/groups',
            stats: '3 Groups',
            color: 'bg-green-50 border-green-200'
        },
        {
            title: 'Branch Access',
            description: 'Manage location-specific access control',
            icon: <Building className="h-8 w-8 text-purple-600"/>,
            path: '/permissions/branches',
            stats: '4 Branches',
            color: 'bg-purple-50 border-purple-200'
        },
        {
            title: 'Audit Log',
            description: 'View permission change history',
            icon: <FileText className="h-8 w-8 text-orange-600"/>,
            path: '/permissions/audit',
            stats: '156 Entries',
            color: 'bg-orange-50 border-orange-200'
        }
    ];

    const quickStats = [
        {label: 'Total Users', value: '45', icon: <Users className="h-5 w-5"/>},
        {label: 'Active Roles', value: '5', icon: <Shield className="h-5 w-5"/>},
        {label: 'Permission Groups', value: '3', icon: <Settings className="h-5 w-5"/>},
        {label: 'Branches', value: '4', icon: <Building className="h-5 w-5"/>}
    ];

    const recentActivity = [
        {
            action: 'Permission granted',
            target: 'Dr. John Smith',
            permission: 'patients.delete',
            time: '2 hours ago',
            status: 'success'
        },
        {
            action: 'Role updated',
            target: 'NURSE role',
            permission: 'billing.update removed',
            time: '4 hours ago',
            status: 'success'
        },
        {
            action: 'Group created',
            target: 'Emergency Staff',
            permission: 'Multiple permissions',
            time: '6 hours ago',
            status: 'success'
        },
        {
            action: 'Access denied',
            target: 'Dr. Mike Brown',
            permission: 'users.delete',
            time: '8 hours ago',
            status: 'failed'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Permissions Overview</h1>
                <Button onClick={() => router.push('/users')}>
                    <Users className="h-4 w-4 mr-2"/>
                    Manage Users
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <StatsCard
                    title="Total Users"
                    value={45}
                    icon={Users}
                    color="text-blue-600"
                    bgGradient="from-blue-500 to-blue-600"
                />
                <StatsCard
                    title="Active Roles"
                    value={5}
                    icon={UserCog}
                    color="text-green-600"
                    bgGradient="from-green-500 to-green-600"
                />
                <StatsCard
                    title="Permission Groups"
                    value={3}
                    icon={Layers}
                    color="text-purple-600"
                    bgGradient="from-purple-500 to-purple-600"
                />
                <StatsCard
                    title="Branches"
                    value={4}
                    icon={Building2}
                    color="text-orange-600"
                    bgGradient="from-orange-500 to-orange-600"
                />
            </div>

            {/* Permission Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {permissionModules.map((module, index) => (
                    <Card key={index} className={`cursor-pointer transition-all hover:shadow-md ${module.color}`}>
                        <CardContent className="p-6" onClick={() => router.push(module.path)}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg">
                                        {module.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                                        <p className="text-muted-foreground mb-3">{module.description}</p>
                                        <Badge variant="outline">{module.stats}</Badge>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Permission Changes</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => router.push('/permissions/audit')}>
                            <Eye className="h-4 w-4 mr-2"/>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.target} • {activity.permission}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/users/create')}
                            >
                                <Users className="h-4 w-4 mr-2"/>
                                Create New User
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/permissions/groups')}
                            >
                                <Settings className="h-4 w-4 mr-2"/>
                                Create Permission Group
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/permissions/roles')}
                            >
                                <Shield className="h-4 w-4 mr-2"/>
                                Modify Role Permissions
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => router.push('/users/bulk-operations')}
                            >
                                <FileText className="h-4 w-4 mr-2"/>
                                Bulk User Operations
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
