'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {ArrowLeft, Clock, Plus, X} from 'lucide-react';
import {api} from '@/lib/api';

const ROLES = ['ADMIN', 'DOCTOR', 'NURSE', 'FINANCE', 'RECEPTIONIST'];

interface TemporaryRole {
    id: string;
    role: string;
    startDate: string;
    endDate: string;
    reason: string;
    grantedBy: string;
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export default function TemporaryRolesPage() {
    const router = useRouter();
    const params = useParams();

    const [temporaryRoles, setTemporaryRoles] = useState<TemporaryRole[]>([]);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemporaryRoles();
    }, [params.id]);

    const fetchTemporaryRoles = async () => {
        try {
            setLoading(true);
            const roles = await api.get(`/api/permissions/temporary/active/${params.id}`);
            setTemporaryRoles(roles || []);
        } catch (error) {
            console.error('Failed to fetch temporary roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [newRole, setNewRole] = useState({
        role: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const grantTemporaryRole = async () => {
        try {
            await api.post(`/api/permissions/temporary/grant/${params.id}`, {
                permission: newRole.role,
                reason: newRole.reason,
                expiresAt: newRole.endDate
            });
            await fetchTemporaryRoles();
            setNewRole({role: '', startDate: '', endDate: '', reason: ''});
            setIsGrantModalOpen(false);
        } catch (error) {
            console.error('Failed to grant temporary role:', error);
        }
    };

    const revokeRole = async (permission: string) => {
        try {
            await api.delete(`/api/permissions/temporary/revoke/${params.id}/${permission}`);
            await fetchTemporaryRoles();
        } catch (error) {
            console.error('Failed to revoke temporary role:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800',
            EXPIRED: 'bg-gray-100 text-gray-800',
            REVOKED: 'bg-red-100 text-red-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Temporary Roles</h1>
                </div>
                <Dialog open={isGrantModalOpen} onOpenChange={setIsGrantModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4"/>
                            Grant Temporary Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Grant Temporary Role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Role</Label>
                                <Select value={newRole.role}
                                        onValueChange={(value) => setNewRole({...newRole, role: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={newRole.startDate}
                                        onChange={(e) => setNewRole({...newRole, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={newRole.endDate}
                                        onChange={(e) => setNewRole({...newRole, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Reason</Label>
                                <Input
                                    placeholder="Reason for temporary role assignment"
                                    value={newRole.reason}
                                    onChange={(e) => setNewRole({...newRole, reason: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={grantTemporaryRole}>Grant Role</Button>
                                <Button variant="outline" onClick={() => setIsGrantModalOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5"/>
                        Active & Historical Temporary Roles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Granted By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {temporaryRoles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        No temporary roles assigned
                                    </TableCell>
                                </TableRow>
                            ) : (
                                temporaryRoles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            <Badge>{role.role}</Badge>
                                        </TableCell>
                                        <TableCell>{role.startDate}</TableCell>
                                        <TableCell>{role.endDate}</TableCell>
                                        <TableCell>{role.reason}</TableCell>
                                        <TableCell>{role.grantedBy}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusBadge(role.status)}>
                                                {role.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {role.status === 'ACTIVE' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => revokeRole(role.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            )}
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
