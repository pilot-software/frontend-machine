'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../components/ui/card';
import {Input} from '../../../../components/ui/input';
import {Badge} from '../../../../components/ui/badge';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../../components/ui/table';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../../../components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../../../../components/ui/tabs';
import {Search, Settings, Shield} from 'lucide-react';
import {apiClient} from '../../../../lib/api';

interface Permission {
    id: string;
    name: string;
    module: string;
    level: 'NONE' | 'READ' | 'WRITE' | 'ADMIN' | 'SUPER_ADMIN';
    description: string;
}

const MODULES = ['Users', 'Patients', 'Medical Records', 'Appointments', 'Billing', 'Queues'];

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('ALL');

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const data = await apiClient.getAllPermissions();
            setPermissions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            setPermissions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPermissions = (permissions || []).filter(perm => {
        const matchesSearch = (perm?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === 'ALL' || perm?.module === selectedModule;
        return matchesSearch && matchesModule;
    });

    const getLevelColor = (level: string) => {
        const colors = {
            NONE: 'bg-gray-100 text-gray-800',
            READ: 'bg-blue-100 text-blue-800',
            WRITE: 'bg-green-100 text-green-800',
            ADMIN: 'bg-orange-100 text-orange-800',
            SUPER_ADMIN: 'bg-red-100 text-red-800'
        };
        return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="permissions">
                <TabsList>
                    <TabsTrigger value="permissions">All Permissions</TabsTrigger>
                    <TabsTrigger value="groups">Permission Groups</TabsTrigger>
                    <TabsTrigger value="users">User Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="permissions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Permissions</p>
                                        <p className="text-2xl font-bold">{permissions.length}</p>
                                    </div>
                                    <Shield className="h-8 w-8 text-blue-600"/>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Active Modules</p>
                                        <p className="text-2xl font-bold">{MODULES.length}</p>
                                    </div>
                                    <Settings className="h-8 w-8 text-purple-600"/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                        <Input
                                            placeholder="Search permissions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={selectedModule} onValueChange={setSelectedModule}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by module"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Modules</SelectItem>
                                        {MODULES.map(module => (
                                            <SelectItem key={module} value={module}>{module}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Permissions ({filteredPermissions.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission</TableHead>
                                        <TableHead>Module</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                                        </TableRow>
                                    ) : filteredPermissions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8">No permissions
                                                found</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPermissions.map((permission) => (
                                            <TableRow key={permission.id}>
                                                <TableCell className="font-medium">{permission.name}</TableCell>
                                                <TableCell>{permission.module}</TableCell>
                                                <TableCell>
                                                    <Badge className={getLevelColor(permission.level)}>
                                                        {permission.level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{permission.description}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="groups">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Groups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Permission groups management coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Permission Overrides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">User permission management coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
