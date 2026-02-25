'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Clock, Edit, FileText, Shield, Save, X, User, Mail, Phone, Briefcase, Building2, MapPin, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { departmentService, ApiDepartment } from '@/lib/services/department';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    department: string;
    phone: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    specialization?: string;
    licenseNumber?: string;
    isActive?: boolean;
    notes?: string;
    lastLogin: string;
    createdAt: string;
}

const ROLES = [
    { value: 'ADMIN', label: 'Administrator', color: 'bg-purple-100 text-purple-700' },
    { value: 'DOCTOR', label: 'Doctor', color: 'bg-blue-100 text-blue-700' },
    { value: 'NURSE', label: 'Nurse', color: 'bg-green-100 text-green-700' },
    { value: 'PATIENT', label: 'Patient', color: 'bg-gray-100 text-gray-700' },
    { value: 'RECEPTIONIST', label: 'Receptionist', color: 'bg-orange-100 text-orange-700' },
    { value: 'TECHNICIAN', label: 'Technician', color: 'bg-teal-100 text-teal-700' },
    { value: 'FINANCE', label: 'Finance', color: 'bg-indigo-100 text-indigo-700' }
];

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [departments, setDepartments] = useState<ApiDepartment[]>([]);
    const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);

    useEffect(() => {
        fetchUser();
        fetchLastLogin();
    }, [params.id]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data = await departmentService.getDepartments();
                setDepartments(data);
            } catch (error) {
                console.error('Failed to load departments:', error);
            }
        };
        loadDepartments();
    }, []);

    const fetchUser = async () => {
        try {
            const userData = await api.get(`/api/users/${params.id}`);
            setUser(userData);
            setEditedUser(userData);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const fetchLastLogin = async () => {
        try {
            const response = await api.post('/api/audit/search', {
                organizationId: 'hospital_org1',
                userId: params.id,
                action: 'LOGIN_SUCCESS',
                entityType: 'AUTH',
                outcome: 'SUCCESS',
                page: 0,
                size: 1
            });
            if (response.content && response.content.length > 0) {
                setLastLoginTime(response.content[0].timestamp);
            }
        } catch (error) {
            console.error('Failed to fetch last login:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser(user);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleSave = async () => {
        if (!editedUser) return;
        setIsSaving(true);
        try {
            const payload = {
                ...editedUser,
                department: editedUser.department ? { id: editedUser.department } : undefined
            };
            await api.put(`/api/users/${params.id}`, payload);
            await fetchUser();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof User, value: any) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [field]: value });
        }
    };

    if (!user) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-3">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading user profile...</p>
            </div>
        </div>
    );

    const displayUser = isEditing ? editedUser : user;
    if (!displayUser) return null;

    const roleInfo = ROLES.find(r => r.value === displayUser.role);
    const statusColor = displayUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground mt-1">View and manage user information</p>
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <Button onClick={handleEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-32 w-32 border-4 border-primary/10">
                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {displayUser.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                    <h3 className="text-xl font-semibold">{displayUser.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{displayUser.email}</p>
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                                        <Badge className={`${roleInfo?.color || 'bg-gray-100 text-gray-700'} px-2.5 py-0.5`}>
                                            {roleInfo?.label || displayUser.role}
                                        </Badge>
                                        <Badge className={`${statusColor} px-2.5 py-0.5`}>
                                            {displayUser.status}
                                        </Badge>
                                    </div>
                                </div>
                                <Separator />
                                <div className="w-full space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="h-4 w-4" />
                                        <span>{displayUser.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {format(new Date(displayUser.createdAt), 'MMM yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Last login {lastLoginTime ? format(new Date(lastLoginTime), 'MMM d, yyyy h:mm a') : 'Never'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/users/${user.id}/permissions`)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Manage Permissions
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/users/${user.id}/temporary-roles`)}>
                                <Clock className="h-4 w-4 mr-2" />
                                Temporary Roles
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/en/users/${user.id}/audit`)}>
                                <FileText className="h-4 w-4 mr-2" />
                                View Activity Log
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Personal details and contact information</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</Label>
                                    <Input value={displayUser.name} onChange={(e) => updateField('name', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
                                    <Input type="email" value={displayUser.email} onChange={(e) => updateField('email', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Phone</Label>
                                    <Input value={displayUser.phone} onChange={(e) => updateField('phone', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Gender</Label>
                                    <Select value={displayUser.gender} onValueChange={(value) => updateField('gender', value)} disabled={!isEditing}>
                                        <SelectTrigger className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30/-90"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</Label>
                                    <Input type="date" value={displayUser.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle>Professional Information</CardTitle>
                                    <CardDescription>Role, department, and credentials</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
                                    <Select value={displayUser.role} onValueChange={(value) => updateField('role', value)} disabled={!isEditing}>
                                        <SelectTrigger className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ROLES.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Department</Label>
                                    <Select value={displayUser.department || ''} onValueChange={(value) => updateField('department', value)} disabled={!isEditing}>
                                        <SelectTrigger className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30"><SelectValue placeholder="Select department" /></SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {(displayUser.role === 'DOCTOR' || displayUser.role === 'NURSE') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Specialization</Label>
                                        <Input value={displayUser.specialization} onChange={(e) => updateField('specialization', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">License Number</Label>
                                        <Input value={displayUser.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle>Address Information</CardTitle>
                                    <CardDescription>Residential address details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Street Address</Label>
                                <Input value={displayUser.address} onChange={(e) => updateField('address', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">City</Label>
                                    <Input value={displayUser.city} onChange={(e) => updateField('city', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">State</Label>
                                    <Input value={displayUser.state} onChange={(e) => updateField('state', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">ZIP Code</Label>
                                    <Input value={displayUser.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Phone className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle>Emergency Contact</CardTitle>
                                    <CardDescription>Contact person in case of emergency</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Contact Name</Label>
                                    <Input value={displayUser.emergencyContact} onChange={(e) => updateField('emergencyContact', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Contact Phone</Label>
                                    <Input value={displayUser.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Notes</Label>
                                <Textarea rows={4} value={displayUser.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Any additional information..." disabled={!isEditing} className="disabled:opacity-100 disabled:cursor-default disabled:bg-muted dark:disabled:bg-muted/30 resize-none" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
