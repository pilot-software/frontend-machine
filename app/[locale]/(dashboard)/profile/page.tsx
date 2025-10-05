'use client';

import {useAuth} from '@/components/providers/AuthContext';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Calendar, Edit, Mail, MapPin, Phone, Shield} from 'lucide-react';

export default function ProfilePage() {
    const {user} = useAuth();

    if (!user) return null;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'doctor':
                return 'bg-blue-100 text-blue-800';
            case 'nurse':
                return 'bg-green-100 text-green-800';
            case 'patient':
                return 'bg-purple-100 text-purple-800';
            case 'finance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Profile</h2>
                <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
            </div>

            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name}/>
                            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold">{user.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRoleColor(user.role)}>
                                    <Shield className="h-3 w-3 mr-1"/>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                                {user.department && (
                                    <Badge variant="outline">{user.department}</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-1">{user.email}</p>
                        </div>
                        <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2"/>
                            Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Your personal details and contact information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="flex items-center space-x-2">
                                <Input id="name" value={user.name} readOnly/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                <Input id="email" value={user.email} readOnly/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground"/>
                                <Input id="phone" value={user.phone || 'Not provided'} readOnly/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground"/>
                                <Input id="department" value={user.department || 'Not assigned'} readOnly/>
                            </div>
                        </div>
                        {user.specialization && (
                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input id="specialization" value={user.specialization} readOnly/>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="joined">Member Since</Label>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <Input id="joined"
                                       value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                                       readOnly/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                        Manage your account preferences and security
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Account Status</h4>
                            <p className="text-sm text-muted-foreground">Your account is currently active</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Change Password</h4>
                            <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
