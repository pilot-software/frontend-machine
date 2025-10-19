'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Switch} from '@/components/ui/switch';
import {ArrowLeft, Save, User, Mail, Phone, Lock, Briefcase, Building2, MapPin, Calendar, Shield, UserCircle2, CheckCircle2} from 'lucide-react';
import {api} from '@/lib/api';

const ROLES = [
  { value: 'ADMIN', label: 'Administrator', icon: Shield, color: 'text-purple-600' },
  { value: 'DOCTOR', label: 'Doctor', icon: UserCircle2, color: 'text-blue-600' },
  { value: 'NURSE', label: 'Nurse', icon: User, color: 'text-green-600' },
  { value: 'PATIENT', label: 'Patient', icon: User, color: 'text-gray-600' },
  { value: 'RECEPTIONIST', label: 'Receptionist', icon: User, color: 'text-orange-600' },
  { value: 'TECHNICIAN', label: 'Technician', icon: Briefcase, color: 'text-teal-600' },
  { value: 'FINANCE', label: 'Finance', icon: Briefcase, color: 'text-indigo-600' }
];
const DEPARTMENTS = ['Emergency', 'Cardiology', 'Pediatrics', 'Surgery', 'Orthopedics', 'Neurology', 'Radiology', 'Laboratory', 'Pharmacy', 'General'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function CreateUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        passwordHash: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        emergencyContact: '',
        emergencyPhone: '',
        specialization: '',
        licenseNumber: '',
        isActive: true,
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/api/users', formData);
            router.push('/users');
        } catch (error) {
            console.error('Failed to create user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedRole = ROLES.find(r => r.value === formData.role);
    const RoleIcon = selectedRole?.icon || User;

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Create New User</h1>
                    <p className="text-muted-foreground mt-1">Add a new user to the hospital system</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600"/>
                            </div>
                            <div>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Personal details and contact information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground"/>Full Name *
                                </Label>
                                <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground"/>Email Address *
                                </Label>
                                <Input id="email" type="email" placeholder="john.doe@hospital.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground"/>Phone Number *
                                </Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})} required>
                                    <SelectTrigger><SelectValue placeholder="Select gender"/></SelectTrigger>
                                    <SelectContent>{GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground"/>Date of Birth
                                </Label>
                                <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Role & Department */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Briefcase className="h-5 w-5 text-purple-600"/>
                            </div>
                            <div>
                                <CardTitle>Role & Department</CardTitle>
                                <CardDescription>Professional information and access level</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role *</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role">
                                            {selectedRole && (
                                                <div className="flex items-center gap-2">
                                                    <RoleIcon className={`h-4 w-4 ${selectedRole.color}`}/>
                                                    {selectedRole.label}
                                                </div>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map(role => {
                                            const Icon = role.icon;
                                            return (
                                                <SelectItem key={role.value} value={role.value}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-4 w-4 ${role.color}`}/>
                                                        {role.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground"/>Department *
                                </Label>
                                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})} required>
                                    <SelectTrigger><SelectValue placeholder="Select department"/></SelectTrigger>
                                    <SelectContent>{DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        {(formData.role === 'DOCTOR' || formData.role === 'NURSE') && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input id="specialization" placeholder="e.g., Cardiology" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber">License Number</Label>
                                    <Input id="licenseNumber" placeholder="e.g., MD-12345" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}/>
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
                                <MapPin className="h-5 w-5 text-green-600"/>
                            </div>
                            <div>
                                <CardTitle>Address Information</CardTitle>
                                <CardDescription>Residential address details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input id="address" placeholder="123 Main Street" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="New York" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" placeholder="NY" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode">ZIP Code</Label>
                                <Input id="zipCode" placeholder="10001" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Phone className="h-5 w-5 text-red-600"/>
                            </div>
                            <div>
                                <CardTitle>Emergency Contact</CardTitle>
                                <CardDescription>Contact person in case of emergency</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="emergencyContact">Contact Name</Label>
                                <Input id="emergencyContact" placeholder="Jane Doe" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                                <Input id="emergencyPhone" type="tel" placeholder="+1 (555) 000-0000" value={formData.emergencyPhone} onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}/>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Access */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Lock className="h-5 w-5 text-orange-600"/>
                            </div>
                            <div>
                                <CardTitle>Security & Access</CardTitle>
                                <CardDescription>Login credentials and account status</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="passwordHash" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground"/>Password *
                                </Label>
                                <Input id="passwordHash" type="password" placeholder="••••••••" value={formData.passwordHash} onChange={(e) => setFormData({...formData, passwordHash: e.target.value})} required/>
                                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center justify-between">
                                    <span>Account Status</span>
                                </Label>
                                <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                                    <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}/>
                                    <Label className="cursor-pointer">{formData.isActive ? 'Active' : 'Inactive'}</Label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea id="notes" placeholder="Any additional information about this user..." rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}/>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                        {isSubmitting ? (
                            <>
                                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2"/>
                                Create User
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
