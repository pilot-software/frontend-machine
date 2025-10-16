'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ArrowLeft, Save} from 'lucide-react';
import {api} from '@/lib/api';

const ROLES = ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'TECHNICIAN', 'FINANCE'];
const DEPARTMENTS = ['Emergency', 'Cardiology', 'Pediatrics', 'Surgery', 'General'];

export default function CreateUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        passwordHash: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/users', formData);
            router.push('/users');
        } catch (error) {
            console.error('Failed to create user:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create New User</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label htmlFor="passwordHash">Password</Label>
                                <Input
                                    id="passwordHash"
                                    type="password"
                                    value={formData.passwordHash}
                                    onChange={(e) => setFormData({...formData, passwordHash: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Role</Label>
                                <Select value={formData.role}
                                        onValueChange={(value) => setFormData({...formData, role: value})}>
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
                            <div>
                                <Label>Department</Label>
                                <Select value={formData.department}
                                        onValueChange={(value) => setFormData({...formData, department: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTMENTS.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5"/>
                            </Button>
                            <Button type="submit" className="flex items-center gap-2">
                                <Save className="h-4 w-4"/>
                                Create User
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
