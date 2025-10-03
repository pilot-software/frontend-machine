'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../../components/ui/card';
import {Button} from '../../../../../components/ui/button';
import {Input} from '../../../../../components/ui/input';
import {Label} from '../../../../../components/ui/label';
import {Badge} from '../../../../../components/ui/badge';
import {Avatar, AvatarFallback} from '../../../../../components/ui/avatar';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../../../../../components/ui/tabs';
import {ArrowLeft, Clock, Edit, FileText, Shield} from 'lucide-react';
import {api} from '../../../../../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  phone: string;
  lastLogin: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const userData = await api.get(`/api/users/${params.id}`);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      await api.put(`/api/users/${params.id}`, updatedData);
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge className="mt-2">{user.role}</Badge>
              </div>
              <div className="w-full space-y-2">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/users/${user.id}/permissions`)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Permissions
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/users/${user.id}/temporary-roles`)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Temporary Roles
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/users/${user.id}/audit`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Audit Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input value={user.name} />
                      ) : (
                        <p className="mt-1">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input value={user.email} />
                      ) : (
                        <p className="mt-1">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input value={user.phone} />
                      ) : (
                        <p className="mt-1">{user.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label>Department</Label>
                      {isEditing ? (
                        <Input value={user.department} />
                      ) : (
                        <p className="mt-1">{user.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <p className="mt-1">
                        <Badge>{user.status}</Badge>
                      </p>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <p className="mt-1">
                        <Badge>{user.role}</Badge>
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => updateUser({ name: user.name, email: user.email, phone: user.phone, department: user.department })}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Logged in</p>
                        <p className="text-sm text-muted-foreground">2024-01-15 10:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Updated patient record</p>
                        <p className="text-sm text-muted-foreground">2024-01-15 09:45 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
