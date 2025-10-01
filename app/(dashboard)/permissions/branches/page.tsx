'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { ArrowLeft, Building, Plus, Edit, Trash2, Search } from 'lucide-react';
import { api } from '../../../../lib/api';

interface Branch {
  id: string;
  name: string;
  location: string;
  type: string;
  userCount: number;
}

interface UserAccess {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  accessLevel: 'FULL' | 'LIMITED' | 'READ_ONLY';
  departments: string[];
}

const BRANCHES: Branch[] = [
  { id: 'main', name: 'Main Hospital', location: 'Downtown', type: 'Hospital', userCount: 45 },
  { id: 'north', name: 'North Clinic', location: 'North District', type: 'Clinic', userCount: 12 },
  { id: 'south', name: 'South Emergency', location: 'South District', type: 'Emergency', userCount: 18 },
  { id: 'west', name: 'West Pediatric', location: 'West District', type: 'Pediatric', userCount: 8 }
];

export default function BranchAccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBranch = searchParams.get('branch') || 'main';

  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranchUsers();
  }, [selectedBranch]);

  const fetchBranchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/permissions/branch/${selectedBranch}/users`);
      setUserAccess(data || []);
    } catch (error) {
      console.error('Failed to fetch branch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserAccess, setNewUserAccess] = useState({
    userId: '',
    accessLevel: 'READ_ONLY' as const,
    departments: [] as string[]
  });

  const currentBranch = BRANCHES.find(b => b.id === selectedBranch);
  
  const filteredUsers = userAccess.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAccessLevelBadge = (level: string) => {
    const colors = {
      FULL: 'bg-green-100 text-green-800',
      LIMITED: 'bg-yellow-100 text-yellow-800',
      READ_ONLY: 'bg-gray-100 text-gray-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const updateUserAccess = async (userId: string, field: string, value: any) => {
    try {
      await api.put(`/api/permissions/branch/${selectedBranch}/user/${userId}`, { [field]: value });
      await fetchBranchUsers();
    } catch (error) {
      console.error('Failed to update user access:', error);
    }
  };

  const removeUserAccess = async (userId: string) => {
    try {
      await api.delete(`/api/permissions/branch/${selectedBranch}/user/${userId}`);
      await fetchBranchUsers();
    } catch (error) {
      console.error('Failed to remove user access:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/permissions/overview')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Branch Access Management</h1>
        </div>
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User to Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User to {currentBranch?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select User</label>
                <Select value={newUserAccess.userId} onValueChange={(value) => setNewUserAccess({...newUserAccess, userId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="5">Nurse Mike Brown</SelectItem>
                    <SelectItem value="6">Finance Lisa Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Access Level</label>
                <Select value={newUserAccess.accessLevel} onValueChange={(value: any) => setNewUserAccess({...newUserAccess, accessLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL">Full Access</SelectItem>
                    <SelectItem value="LIMITED">Limited Access</SelectItem>
                    <SelectItem value="READ_ONLY">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsAddUserModalOpen(false)}>Add User</Button>
                <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedBranch} onValueChange={(value) => router.push(`/permissions/branches?branch=${value}`)}>
        <TabsList className="grid w-full grid-cols-4">
          {BRANCHES.map(branch => (
            <TabsTrigger key={branch.id} value={branch.id}>
              <Building className="h-4 w-4 mr-2" />
              {branch.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {BRANCHES.map(branch => (
          <TabsContent key={branch.id} value={branch.id}>
            <div className="space-y-6">
              {/* Branch Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{branch.name}</h3>
                      <p className="text-muted-foreground">{branch.location} • {branch.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{branch.userCount}</p>
                      <p className="text-sm text-muted-foreground">Users with access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search */}
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>User Access for {branch.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>Departments</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.userId}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.userName}</p>
                                <p className="text-sm text-muted-foreground">{user.userEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge>{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={user.accessLevel}
                                onValueChange={(value: any) => updateUserAccess(user.userId, 'accessLevel', value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FULL">Full</SelectItem>
                                  <SelectItem value="LIMITED">Limited</SelectItem>
                                  <SelectItem value="READ_ONLY">Read Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.departments.map(dept => (
                                  <Badge key={dept} variant="outline" className="text-xs">
                                    {dept}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeUserAccess(user.userId)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
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
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}