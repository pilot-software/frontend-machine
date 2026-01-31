'use client';

import React, {useEffect, useState} from 'react';
import {AuthGuard} from '@/components/shared/guards/AuthGuard';
import {PageHeader} from '@/components/shared/PageHeader';
import {ViewToggle} from '@/components/shared/ViewToggle';
import {SearchFilter} from '@/components/shared/SearchFilter';
import {useRouter, useSearchParams} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
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
import { StatsCard } from '@/components/ui/stats-card';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

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

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <PageHeader
                title="User Management"
                description="Manage hospital staff and user accounts"
                action={
                    <Button onClick={() => router.push('/users/create')} className="flex items-center gap-2">
                        <Plus className="h-4 w-4"/>
                        Create User
                    </Button>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <StatsCard
                    title="Total Users"
                    value={users.length}
                    icon={Users}
                    color="text-blue-600"
                    bgGradient="from-blue-500 to-blue-600"
                    change="All users"
                    trend="neutral"
                />
                <StatsCard
                    title="Active Users"
                    value={users.filter(u => u.status === 'ACTIVE').length}
                    icon={Activity}
                    color="text-green-600"
                    bgGradient="from-green-500 to-green-600"
                    change={`${Math.round((users.filter(u => u.status === 'ACTIVE').length / users.length) * 100)}%`}
                    trend="up"
                />
                <StatsCard
                    title="Doctors"
                    value={users.filter(u => u.role === 'DOCTOR').length}
                    icon={Shield}
                    color="text-purple-600"
                    bgGradient="from-purple-500 to-purple-600"
                    change="Medical staff"
                    trend="neutral"
                />
                <StatsCard
                    title="Admins"
                    value={users.filter(u => u.role === 'ADMIN').length}
                    icon={Settings}
                    color="text-red-600"
                    bgGradient="from-red-500 to-red-600"
                    change="System admins"
                    trend="neutral"
                />
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-orange-900 dark:text-orange-100">{selectedUsers.length} users selected</span>
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
                                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                                        <AlertTriangle className="h-4 w-4"/>
                                        <span className="font-medium">Warning:</span>
                                    </div>
                                    <p className="text-red-700 dark:text-red-300 mt-1">
                                        This action will permanently delete {selectedUsers.length} user(s). This cannot
                                        be undone.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search users by name or email..."
                filters={
                    <>
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
                    </>
                }
            />

            {/* Mobile: 2-column grid */}
            <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3">
                    {loading ? (
                        <Card className="col-span-2">
                            <CardContent className="p-6 text-center">
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            </CardContent>
                        </Card>
                    ) : paginatedUsers.length === 0 ? (
                        <Card className="col-span-2">
                            <CardContent className="p-6 text-center">
                                <p className="text-sm text-muted-foreground">No users found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        paginatedUsers.map((user) => (
                            <Card key={user.id} className="hover:shadow-md transition-shadow" onClick={() => {
                                setSelectedUser(user);
                                setIsDetailModalOpen(true);
                            }}>
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar className="h-10 w-10 mb-2">
                                            <AvatarFallback className="text-sm">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-semibold text-xs truncate w-full">{user.name}</h3>
                                        <Badge className={`${getRoleBadgeColor(user.role)} text-xs mt-1`}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Desktop: Table view */}
            <Card className="hidden lg:block">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
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
                                ) : paginatedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/50">
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
                                            <TableCell className="text-sm text-muted-foreground">{user.lastLogin || 'Never'}</TableCell>
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
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <Card>
                    <CardContent className="p-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                                <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{" "}
                                <span className="font-medium text-foreground">{filteredUsers.length}</span> users
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={`${pageSize}`} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1); }}>
                                    <SelectTrigger className="h-8 w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 25, 50, 100].map((size) => (
                                            <SelectItem key={size} value={`${size}`}>{size} rows</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                                <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm font-medium">
                                    <span>{currentPage}</span>
                                    <span className="text-muted-foreground">/</span>
                                    <span>{totalPages}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* User Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl">
                                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2 justify-center">
                                        <Badge className={getRoleBadgeColor(selectedUser.role)}>
                                            {selectedUser.role}
                                        </Badge>
                                        <Badge className={getStatusBadgeColor(selectedUser.status)}>
                                            {selectedUser.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between p-3 bg-muted/30 rounded">
                                    <span className="text-sm font-medium">Department</span>
                                    <span className="text-sm">{selectedUser.department || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-muted/30 rounded">
                                    <span className="text-sm font-medium">Phone</span>
                                    <span className="text-sm">{selectedUser.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-muted/30 rounded">
                                    <span className="text-sm font-medium">Last Login</span>
                                    <span className="text-sm">{selectedUser.lastLogin || 'Never'}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Button onClick={() => router.push(`/users/${selectedUser.id}/profile`)} className="w-full">
                                    <Edit className="h-4 w-4 mr-2"/>
                                    View Full Profile
                                </Button>
                                <Button variant="outline" className="w-full"
                                        onClick={() => router.push(`/users/${selectedUser.id}/permissions`)}>
                                    <Shield className="h-4 w-4 mr-2"/>
                                    Manage Permissions
                                </Button>
                                <Button variant="outline" className="w-full"
                                        onClick={() => router.push(`/users/${selectedUser.id}/audit`)}>
                                    <Activity className="h-4 w-4 mr-2"/>
                                    View Audit Log
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
        <AuthGuard requiredPermissions={['VIEW_USER', 'CREATE_USER', 'UPDATE_USER', 'DEACTIVATE_USER']}>
            <UserManagementPageContent/>
        </AuthGuard>
    );
}
