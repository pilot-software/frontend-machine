'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../components/ui/card';
import {Button} from '../../../../components/ui/button';
import {Input} from '../../../../components/ui/input';
import {Label} from '../../../../components/ui/label';
import {Badge} from '../../../../components/ui/badge';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../../components/ui/table';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '../../../../components/ui/dialog';
import {ArrowLeft, Edit, Plus, Trash2, Users} from 'lucide-react';
import {api} from '../../../../lib/api';

interface PermissionGroup {
    name: string;
    description: string;
    permissions: string[];
    roleCount: number;
    roles: string[];
    created: string;
    systemDefault: boolean;
}

export default function PermissionGroupsPage() {
    const router = useRouter();

    const [groups, setGroups] = useState<PermissionGroup[]>([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });

    const availablePermissions = [
        'users.create', 'users.read', 'users.update', 'users.delete',
        'patients.create', 'patients.read', 'patients.update', 'patients.delete',
        'medical_records.create', 'medical_records.read', 'medical_records.update',
        'appointments.create', 'appointments.read', 'appointments.update', 'appointments.delete',
        'billing.create', 'billing.read', 'billing.update', 'billing.process_payment',
        'queues.create', 'queues.read', 'queues.update', 'queues.manage_all'
    ];

    const fetchGroups = async () => {
        try {
            const data = await api.get('/api/permissions/groups/detailed');
            setGroups(data || []);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };

    const createGroup = async () => {
        try {
            await api.post('/api/permissions/groups', newGroup);
            await fetchGroups();
            setNewGroup({name: '', description: '', permissions: []});
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    const deleteGroup = async (groupId: string) => {
        try {
            await api.delete(`/api/permissions/groups/${groupId}`);
            await fetchGroups();
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const togglePermission = (permission: string) => {
        setNewGroup(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/permissions/overview')}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <h1 className="text-2xl font-bold">Permission Groups</h1>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4"/>
                            Create Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Permission Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Group Name</Label>
                                <Input
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                    placeholder="Enter group name"
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                                    placeholder="Enter group description"
                                />
                            </div>
                            <div>
                                <Label>Permissions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                                    {availablePermissions.map(permission => (
                                        <div key={permission} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={permission}
                                                checked={newGroup.permissions.includes(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="rounded"
                                            />
                                            <Label htmlFor={permission} className="text-sm">
                                                {permission}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={createGroup}>Create Group</Button>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permission Groups ({groups.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Group Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groups.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No permission groups found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groups.map((group) => (
                                    <TableRow key={group.name}>
                                        <TableCell className="font-medium">{group.name}</TableCell>
                                        <TableCell className="max-w-xs truncate">{group.description}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {group.permissions.map(permission => (
                                                    <Badge key={permission} variant="outline" className="text-xs">
                                                        {permission}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4"/>
                                                {group.roleCount}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(group.created).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteGroup(group.name)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
