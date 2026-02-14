'use client';

import {useState} from 'react';
import {useAuth} from '@/components/providers/AuthContext';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from '@/components/ui/alert-dialog';
import {Calendar, Edit, Mail, MapPin, Phone, Shield, User, Save, X, Trash2} from 'lucide-react';
import {ChangePasswordModal} from '@/components/features/settings/ChangePasswordModal';
import {useAlert} from '@/components/AlertProvider';
import {api} from '@/lib/api';

export default function ProfilePage() {
    const {user} = useAuth();
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const {success, error} = useAlert();

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

    const handleSavePersonalInfo = async () => {
        if (!formData.name.trim()) {
            error("Name is required");
            return;
        }

        setIsLoading(true);
        try {
            await api.updateProfile({
                name: formData.name,
                phone: formData.phone,
            });
            success("Profile updated successfully");
            setIsEditingPersonal(false);
        } catch (err: any) {
            error(err.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            phone: user.phone || '',
        });
        setIsEditingPersonal(false);
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
                        <Avatar className="h-20 w-20 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
                            <AvatarImage src={user.avatar} alt={user.name} className="transition-all duration-300 hover:brightness-110 rounded-full"/>
                            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-bold rounded-full">{getInitials(user.name)}</AvatarFallback>
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
                        {!isEditingPersonal && (
                            <Button variant="outline" onClick={() => setIsEditingPersonal(true)}>
                                <Edit className="h-4 w-4 mr-2"/>
                                Edit Profile
                            </Button>
                        )}
                        {isEditingPersonal && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 mr-2"/>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSavePersonalInfo}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4 mr-2"/>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
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
                                <User className="h-4 w-4 text-muted-foreground"/>
                                <Input 
                                    id="name" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    readOnly={!isEditingPersonal}
                                    disabled={isLoading}
                                    className={!isEditingPersonal ? 'bg-muted cursor-not-allowed' : 'border-2 border-primary'}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                <Input id="email" value={user.email} readOnly className="bg-muted cursor-not-allowed"/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground"/>
                                <Input 
                                    id="phone" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    readOnly={!isEditingPersonal}
                                    disabled={isLoading}
                                    className={!isEditingPersonal ? 'bg-muted cursor-not-allowed' : 'border-2 border-primary'}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground"/>
                                <Input id="department" value={user.department || 'Not assigned'} readOnly className="bg-muted cursor-not-allowed"/>
                            </div>
                        </div>
                        {user.specialization && (
                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input id="specialization" value={user.specialization} readOnly className="bg-muted cursor-not-allowed"/>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="joined">Member Since</Label>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <Input id="joined"
                                       value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                                       readOnly className="bg-muted cursor-not-allowed"/>
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
                        <Button variant="outline" onClick={() => setPasswordModalOpen(true)}>Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50/50 dark:bg-red-950/30">
                        <div>
                            <h4 className="font-medium text-red-900 dark:text-red-400">Delete Account</h4>
                            <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ChangePasswordModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                            success("Account deletion requested. API integration pending.");
                            setDeleteDialogOpen(false);
                        }}>
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
