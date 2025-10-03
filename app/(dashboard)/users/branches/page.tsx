'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../components/ui/card';
import {Button} from '../../../../components/ui/button';
import {Input} from '../../../../components/ui/input';
import {Badge} from '../../../../components/ui/badge';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../../components/ui/table';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../../../components/ui/select';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../../../../components/ui/dialog';
import {Building, MapPin, Plus, Search, Shield, Users} from 'lucide-react';
import {apiClient} from '../../../../lib/api';

interface Branch {
    id: string;
    name: string;
    location: string;
    userCount: number;
    status: 'ACTIVE' | 'INACTIVE';
}

interface BranchUserPermission {
    userId: string;
    userName: string;
    role: string;
    branchId: string;
    branchName: string;
    permissions: string[];
    accessLevel: 'FULL' | 'LIMITED' | 'READ_ONLY';
}

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchPermissions, setBranchPermissions] = useState<BranchUserPermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('ALL');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const branchesData = await apiClient.getBranches();
            setBranches(branchesData || []);

            // Fetch permissions for each branch
            if (branchesData?.length > 0) {
                const permissionsPromises = branchesData.map((branch: Branch) =>
                    apiClient.getBranchUserPermissions(branch.id)
                );
                const permissionsResults = await Promise.all(permissionsPromises);
                setBranchPermissions(permissionsResults.flat());
            }
        } catch (error) {
            console.error('Failed to fetch branch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPermissions = branchPermissions.filter(perm => {
        const matchesSearch = (perm?.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (perm?.branchName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranch === 'ALL' || perm?.branchId === selectedBranch;
        return matchesSearch && matchesBranch;
    });

    const getAccessLevelColor = (level: string) => {
        const colors = {
            FULL: 'bg-green-100 text-green-800',
            LIMITED: 'bg-yellow-100 text-yellow-800',
            READ_ONLY: 'bg-blue-100 text-blue-800'
        };
        return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Branches</p>
                                <p className="text-2xl font-bold">{branches.length}</p>
                            </div>
                            <Building className="h-8 w-8 text-blue-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Branches</p>
                                <p className="text-2xl font-bold">{branches.filter(b => b.status === 'ACTIVE').length}</p>
                            </div>
                            <MapPin className="h-8 w-8 text-green-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{branches.reduce((sum, b) => sum + (b.userCount || 0), 0)}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Permission Overrides</p>
                                <p className="text-2xl font-bold">{branchPermissions.length}</p>
                            </div>
                            <Shield className="h-8 w-8 text-orange-600"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Branches Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Branch Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {branches.map((branch) => (
                            <Card key={branch.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold">{branch.name}</h3>
                                            <p className="text-sm text-muted-foreground">{branch.location}</p>
                                        </div>
                                        <Badge className={getStatusColor(branch.status)}>
                                            {branch.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground"/>
                                            <span className="text-sm">{branch.userCount} users</span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Manage
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Branch User Permissions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Branch User Permissions</CardTitle>
                        <Button onClick={() => setIsAssignModalOpen(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4"/>
                            Assign Permission
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Search users or branches..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by branch"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Branches</SelectItem>
                                {branches.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Access Level</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading branch permissions...
                                    </TableCell>
                                </TableRow>
                            ) : filteredPermissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No branch permissions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPermissions.map((perm, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{perm.userName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{perm.role}</Badge>
                                        </TableCell>
                                        <TableCell>{perm.branchName}</TableCell>
                                        <TableCell>
                                            <Badge className={getAccessLevelColor(perm.accessLevel)}>
                                                {perm.accessLevel.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {perm.permissions.slice(0, 2).map((permission, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {permission}
                                                    </Badge>
                                                ))}
                                                {perm.permissions.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{perm.permissions.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Assign Permission Modal */}
            <AssignBranchPermissionModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                branches={branches}
                onSuccess={fetchData}
            />
        </div>
    );
}

function AssignBranchPermissionModal({
                                         isOpen,
                                         onClose,
                                         branches,
                                         onSuccess
                                     }: {
    isOpen: boolean;
    onClose: () => void;
    branches: Branch[];
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        userId: '',
        branchId: '',
        accessLevel: 'LIMITED',
        permissions: [] as string[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.assignBranchPermissions(formData.branchId, formData.userId, {
                accessLevel: formData.accessLevel,
                permissions: formData.permissions
            });
            onSuccess();
            onClose();
            setFormData({userId: '', branchId: '', accessLevel: 'LIMITED', permissions: []});
        } catch (error) {
            console.error('Failed to assign branch permission:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Branch Permission</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">User ID</label>
                        <Input
                            value={formData.userId}
                            onChange={(e) => setFormData({...formData, userId: e.target.value})}
                            placeholder="Enter user ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Branch</label>
                        <Select value={formData.branchId}
                                onValueChange={(value) => setFormData({...formData, branchId: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select branch"/>
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Access Level</label>
                        <Select value={formData.accessLevel}
                                onValueChange={(value) => setFormData({...formData, accessLevel: value})}>
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FULL">Full Access</SelectItem>
                                <SelectItem value="LIMITED">Limited Access</SelectItem>
                                <SelectItem value="READ_ONLY">Read Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Assign Permission</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
