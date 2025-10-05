'use client';

import React, {useEffect, useState} from 'react';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {useRouter, useSearchParams} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {
    Activity,
    AlertTriangle,
    Edit,
    Eye,
    Plus,
    Search,
    Settings,
    Shield,
    Trash2,
    UserCheck,
    Users
} from 'lucide-react';
import {api} from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
    department?: string;
    lastLogin?: string;
    phone?: string;
}

const ROLES = ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'TECHNICIAN', 'FINANCE'];

function UserManagementPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'ALL');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [bulkAction, setBulkAction] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let data;
            if (roleFilter !== 'ALL') {
                data = await api.get(`/api/users/role/${roleFilter}`);
            } else {
                data = await api.get('/api/users');
            }
            setUsers(data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            setDeleting(userId);
            await api.delete(`/api/users/${userId}`);
            await fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setDeleting(null);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const selectAllUsers = () => {
        setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
    };

    const executeBulkAction = async () => {
        if (!bulkAction || selectedUsers.length === 0) return;

        try {
            switch (bulkAction) {
                case 'delete':
                    await Promise.all(selectedUsers.map(id => api.delete(`/api/users/${id}`)));
                    break;
                case 'activate':
                    await Promise.all(selectedUsers.map(id => api.put(`/api/ops/users/${id}/status`, {status: 'ACTIVE'})));
                    break;
                case 'deactivate':
                    await Promise.all(selectedUsers.map(id => api.put(`/api/ops/users/${id}/status`, {status: 'INACTIVE'})));
                    break;
                case 'change_role':
                    if (newRole) {
                        await Promise.all(selectedUsers.map(id => api.put(`/api/ops/users/${id}/role`, {role: newRole})));
                    }
                    break;
            }

            await fetchUsers();
            setSelectedUsers([]);
            setBulkAction('');
            setNewRole('');
        } catch (error) {
            console.error('Failed to execute bulk action:', error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadgeColor = (role: string) => {
        const colors = {
            ADMIN: 'bg-red-100 text-red-800',
            DOCTOR: 'bg-blue-100 text-blue-800',
            NURSE: 'bg-green-100 text-green-800',
            FINANCE: 'bg-yellow-100 text-yellow-800',
            RECEPTIONIST: 'bg-purple-100 text-purple-800'
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadgeColor = (status: string) => {
        return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button onClick={() => router.push('/users/create')} className="flex items-center gap-2">
                        <Plus className="h-4 w-4"/>
                        Create User
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.status === 'ACTIVE').length}</p>
                            </div>
                            <Activity className="h-8 w-8 text-green-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Doctors</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'DOCTOR').length}</p>
                            </div>
                            <Shield className="h-8 w-8 text-blue-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Admins</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
                            </div>
                            <Settings className="h-8 w-8 text-red-600"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{selectedUsers.length} users selected</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUsers([])}
                                >
                                    Clear Selection
                                </Button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select action"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activate">Activate Users</SelectItem>
                                        <SelectItem value="deactivate">Deactivate Users</SelectItem>
                                        <SelectItem value="change_role">Change Role</SelectItem>
                                        <SelectItem value="delete">Delete Users</SelectItem>
                                    </SelectContent>
                                </Select>

                                {bulkAction === 'change_role' && (
                                    <Select value={newRole} onValueChange={setNewRole}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select new role"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLES.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                <Button
                                    onClick={executeBulkAction}
                                    disabled={!bulkAction || selectedUsers.length === 0}
                                    variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                                    className="flex items-center gap-2"
                                >
                                    {bulkAction === 'delete' && <Trash2 className="h-4 w-4"/>}
                                    {bulkAction === 'activate' && <UserCheck className="h-4 w-4"/>}
                                    {bulkAction === 'deactivate' && <AlertTriangle className="h-4 w-4"/>}
                                    Execute Action
                                </Button>
                            </div>

                            {bulkAction === 'delete' && selectedUsers.length > 0 && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex items-center gap-2 text-red-800">
                                        <AlertTriangle className="h-4 w-4"/>
                                        <span className="font-medium">Warning:</span>
                                    </div>
                                    <p className="text-red-700 mt-1">
                                        This action will permanently delete {selectedUsers.length} user(s). This cannot
                                        be undone.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                {ROLES.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={selectAllUsers}
                                    />
                                </TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => toggleUserSelection(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.department || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadgeColor(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.lastLogin || 'Never'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/users/${user.id}/profile`)}
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={deleting === user.id}
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

            {/* User Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <Badge className={getRoleBadgeColor(selectedUser.role)}>
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Department</Label>
                                    <p>{selectedUser.department || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusBadgeColor(selectedUser.status)}>
                                        {selectedUser.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <p>{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label>Last Login</Label>
                                    <p>{selectedUser.lastLogin || 'Never'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.push(`/users/${selectedUser.id}/profile`)}>
                                    View Profile
                                </Button>
                                <Button variant="outline"
                                        onClick={() => router.push(`/users/${selectedUser.id}/permissions`)}>
                                    Manage Permissions
                                </Button>
                                <Button variant="outline"
                                        onClick={() => router.push(`/users/${selectedUser.id}/audit`)}>
                                    Audit Log
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function UserManagementPage() {
    return (
        <AuthGuard requiredPermissions={['USERS_VIEW', 'USERS_CREATE_STAFF', 'USERS_UPDATE', 'USERS_DELETE']}>
            <UserManagementPageContent/>
        </AuthGuard>
    );
}
