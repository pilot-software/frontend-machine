'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { 
  Shield, Users, Building, FileText, Plus, Search, Edit, Trash2, 
  Eye, Settings, UserCog, Layers, Building2, CheckCircle, XCircle,
  AlertTriangle, Clock, Filter, Download, Upload, Palette, Bell, Database, Lock, User
} from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import { permissionService } from '@/lib/services/permission';
import { useAuth } from '@/components/providers/AuthContext';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchPermissionCatalog } from '@/lib/store/slices/permissionsSlice';
import { fetchOrganizationPermissions } from '@/lib/store/slices/permissionsSlice';

interface PermissionCatalogItem {
  id: number;
  permissionCode: string;
  permissionName: string;
  category: string;
  isSystem: boolean;
}

interface OrganizationPermission {
  id: number;
  permissionCode: string;
  permissionName: string;
  organizationId: string;
  isEnabled: boolean;
}

interface PermissionGroup {
  id: number;
  groupName: string;
  description?: string;
  organizationId: string;
  permissions: string[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface UserPermission {
  userId: string;
  userName: string;
  email: string;
  groups: PermissionGroup[];
  effectivePermissions: string[];
  customPermissions: string[];
}

interface AuditLogEntry {
  id: string;
  action: string;
  target: string;
  permission: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'success' | 'failed';
}

type PermissionSection = "overview" | "catalog" | "groups" | "users" | "audit" | "settings";

export default function PermissionsPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { catalog: permissionCatalog, loading: catalogLoading, organizationPermissions } = useAppSelector(state => state.permissions);
  const [activeSection, setActiveSection] = useState<PermissionSection>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  
  // Modal states
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAssignPermissions, setShowAssignPermissions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  
  // Form states
  const [newGroup, setNewGroup] = useState({ name: '', description: '', permissions: [] as string[] });
  const [assignmentData, setAssignmentData] = useState({ groupIds: [] as number[], customPermissions: [] as string[] });

  useEffect(() => {
    loadInitialData();
    dispatch(fetchPermissionCatalog());
    dispatch(fetchOrganizationPermissions());
  }, [dispatch]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPermissionGroups(),
        loadAuditLogs(),
        loadAvailableUsers()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissionCatalog = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permissions/organization/permissions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPermissionCatalog(data);
      }
    } catch (error) {
      console.error('Failed to load permission catalog:', error);
    }
  };



  const loadPermissionGroups = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permissions/groups', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPermissionGroups(data);
      }
    } catch (error) {
      console.error('Failed to load permission groups:', error);
    }
  };

  const loadAvailableUsers = async () => {
    const mockUsers = [
      { id: 'user_admin_1', name: 'Admin User', email: 'admin@hospital.com' },
      { id: 'user_doctor_1', name: 'Dr. John Smith', email: 'john.smith@hospital.com' },
      { id: 'user_nurse_1', name: 'Nurse Jane Doe', email: 'jane.doe@hospital.com' },
      { id: 'user_receptionist_1', name: 'Mary Johnson', email: 'mary.johnson@hospital.com' },
    ];
    setAvailableUsers(mockUsers);
  };

  const loadAuditLogs = async () => {
    const mockLogs: AuditLogEntry[] = [
      {
        id: '1',
        action: 'Permission granted',
        target: 'Dr. John Smith',
        permission: 'VIEW_PATIENTS',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        action: 'Group created',
        target: 'Emergency Staff',
        permission: 'Multiple permissions',
        userId: 'user1',
        userName: 'Admin User',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      }
    ];
    setAuditLogs(mockLogs);
  };

  const createPermissionGroup = async () => {
    try {
      console.log('Selected permissions:', newGroup.permissions);
      console.log('Organization permissions:', organizationPermissions);
      
      // Map permission codes to organization permission IDs
      const orgPermissionIds = newGroup.permissions.map(permCode => {
        const orgPerm = organizationPermissions.find(p => p.permissionCode === permCode);
        console.log(`Mapping ${permCode} to ID:`, orgPerm?.id);
        return orgPerm?.id;
      }).filter(id => id !== undefined);

      console.log('Final org permission IDs:', orgPermissionIds);

      const response = await fetch('http://localhost:8080/api/permissions/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          groupName: newGroup.name,
          description: newGroup.description,
          organizationPermissionIds: orgPermissionIds
        })
      });
      
      if (response.ok) {
        await loadPermissionGroups();
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '', permissions: [] });
      }
    } catch (error) {
      console.error('Failed to create permission group:', error);
    }
  };

  const assignPermissionsToUser = async () => {
    if (!selectedUser) return;
    
    try {
      if (assignmentData.groupIds.length > 0) {
        await fetch(`http://localhost:8080/api/permissions/users/${selectedUser}/groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ groupIds: assignmentData.groupIds })
        });
      }
      
      if (assignmentData.customPermissions.length > 0) {
        await fetch(`http://localhost:8080/api/permissions/users/${selectedUser}/custom`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            permissions: assignmentData.customPermissions.map(p => ({ permissionId: p, isGranted: true }))
          })
        });
      }
      
      setShowAssignPermissions(false);
      setAssignmentData({ groupIds: [], customPermissions: [] });
    } catch (error) {
      console.error('Failed to assign permissions:', error);
    }
  };

  const toggleOrganizationPermission = async (permissionId: number, isEnabled: boolean) => {
    try {
      await fetch(`http://localhost:8080/api/permissions/organization/permissions/${permissionId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ isEnabled })
      });
      await dispatch(fetchOrganizationPermissions());
    } catch (error) {
      console.error('Failed to toggle permission:', error);
    }
  };

  const filteredPermissions = organizationPermissions.filter(p => 
    p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = permissionGroups.filter(g => 
    g.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = organizationPermissions.reduce((acc, perm) => {
    const category = perm.permissionCode.split('_')[0] || 'GENERAL';
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, OrganizationPermission[]>);

  const groupedCatalogPermissions = organizationPermissions.reduce((acc, perm) => {
    const category = perm.permissionCode.split('_')[0] || 'GENERAL';
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, OrganizationPermission[]>);

  const sections = [
    { id: "overview" as PermissionSection, label: "Overview", icon: Eye },
    { id: "catalog" as PermissionSection, label: "Catalog", icon: Shield },
    { id: "groups" as PermissionSection, label: "Groups", icon: Users },
    { id: "users" as PermissionSection, label: "Users", icon: UserCog },
    { id: "audit" as PermissionSection, label: "Audit", icon: FileText },
    { id: "settings" as PermissionSection, label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Permissions Management</h2>
        <p className="text-muted-foreground mt-1">Manage roles, permissions, and access control</p>
      </div>

      {/* Horizontal Tabs */}
      <div className="border-b -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                  activeSection === section.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Overview */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <StatsCard
                title="Total Permissions"
                value={organizationPermissions.length}
                icon={Shield}
                color="text-blue-600"
                bgGradient="from-blue-500 to-blue-600"
              />
              <StatsCard
                title="Permission Groups"
                value={permissionGroups.length}
                icon={Users}
                color="text-green-600"
                bgGradient="from-green-500 to-green-600"
              />
              <StatsCard
                title="Active Users"
                value={userPermissions.length}
                icon={UserCog}
                color="text-purple-600"
                bgGradient="from-purple-500 to-purple-600"
              />
              <StatsCard
                title="Audit Entries"
                value={auditLogs.length}
                icon={FileText}
                color="text-orange-600"
                bgGradient="from-orange-500 to-orange-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.target} • {log.permission}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowCreateGroup(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Permission Group
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowAssignPermissions(true)}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      Assign User Permissions
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveSection('catalog')}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Permission Catalog
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Catalog */}
        {activeSection === "catalog" && (
          <Card>
            <CardHeader>
              <CardTitle>Permission Catalog</CardTitle>
              <CardDescription>Manage organization permissions and their availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setActiveSection('groups')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm">{category.replace('_', ' ')}</h4>
                    <div className="space-y-2">
                      {permissions.filter(p => 
                        p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((permission, index) => (
                        <div key={`${category}-${permission.id || permission.permissionCode || index}`} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{permission.permissionName}</p>
                            <p className="text-xs text-muted-foreground">{permission.permissionCode}</p>
                          </div>
                          <Checkbox
                            checked={permission.isEnabled}
                            onCheckedChange={(checked) => 
                              toggleOrganizationPermission(permission.id, checked as boolean)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Groups */}
        {activeSection === "groups" && (
          <Card>
            <CardHeader>
              <CardTitle>Permission Groups</CardTitle>
              <CardDescription>Create and manage permission groups for role-based access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowCreateGroup(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{group.groupName}</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(group)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{group.permissions.length} permissions</Badge>
                      <span className="text-xs text-muted-foreground">
                        {group.userCount || 0} users
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users */}
        {activeSection === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Permission Groups</CardTitle>
                <CardDescription>Assign permission groups to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">Select User</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Available Groups</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                      {permissionGroups.map((group) => (
                        <div key={group.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assign-group-${group.id}`}
                            checked={assignmentData.groupIds.includes(group.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAssignmentData({
                                  ...assignmentData,
                                  groupIds: [...assignmentData.groupIds, group.id]
                                });
                              } else {
                                setAssignmentData({
                                  ...assignmentData,
                                  groupIds: assignmentData.groupIds.filter(id => id !== group.id)
                                });
                              }
                            }}
                          />
                          <label htmlFor={`assign-group-${group.id}`} className="text-sm">
                            {group.groupName} ({group.permissions.length} permissions)
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={assignPermissionsToUser} disabled={!selectedUser || assignmentData.groupIds.length === 0}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Assign Groups to User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>View and manage individual user permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Effective Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPermissions.map((userPerm) => (
                      <TableRow key={userPerm.userId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{userPerm.userName}</p>
                            <p className="text-sm text-muted-foreground">{userPerm.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userPerm.groups.map((group) => (
                              <Badge key={group.id} variant="outline" className="text-xs">
                                {group.groupName}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {userPerm.effectivePermissions.length} permissions
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audit */}
        {activeSection === "audit" && (
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all permission changes and security events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{log.permission}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status === 'success' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        {activeSection === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Permission Settings</CardTitle>
              <CardDescription>Configure permission system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-assign Default Permissions</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign basic permissions to new users</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Permission Inheritance</Label>
                  <p className="text-sm text-muted-foreground">Allow permissions to be inherited from parent groups</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Permission Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Permission Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="Enter group description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Permissions</label>
              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto border rounded p-3">
                {catalogLoading ? (
                  <p className="text-muted-foreground text-sm">Loading permissions...</p>
                ) : organizationPermissions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No permissions available</p>
                ) : (
                  Object.entries(groupedCatalogPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={permissions.length > 0 && permissions.every(p => newGroup.permissions.includes(p.permissionCode))}
                          indeterminate={permissions.some(p => newGroup.permissions.includes(p.permissionCode)) && !permissions.every(p => newGroup.permissions.includes(p.permissionCode))}
                          onCheckedChange={(checked) => {
                            const categoryPermissionCodes = permissions.map(p => p.permissionCode);
                            if (checked) {
                              setNewGroup(prev => ({
                                ...prev,
                                permissions: [...new Set([...prev.permissions, ...categoryPermissionCodes])]
                              }));
                            } else {
                              setNewGroup(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => !categoryPermissionCodes.includes(p))
                              }));
                            }
                          }}
                        />
                        <label htmlFor={`category-${category}`} className="font-medium text-sm">
                          {category.replace('_', ' ')}
                        </label>
                      </div>
                      <div className="grid grid-cols-1 gap-2 ml-6">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`perm-${permission.permissionCode}`}
                              checked={newGroup.permissions.includes(permission.permissionCode)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewGroup(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.permissionCode]
                                  }));
                                } else {
                                  setNewGroup(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission.permissionCode)
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={`perm-${permission.permissionCode}`} className="text-sm">
                              {permission.permissionName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                Cancel
              </Button>
              <Button onClick={createPermissionGroup}>
                Create Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Permissions Modal */}
      <Dialog open={showAssignPermissions} onOpenChange={setShowAssignPermissions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Permissions to User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {userPermissions.map((user) => (
                    <SelectItem key={user.userId} value={user.userId}>
                      {user.userName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Permission Groups</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                {permissionGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={assignmentData.groupIds.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAssignmentData({
                            ...assignmentData,
                            groupIds: [...assignmentData.groupIds, group.id]
                          });
                        } else {
                          setAssignmentData({
                            ...assignmentData,
                            groupIds: assignmentData.groupIds.filter(id => id !== group.id)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`group-${group.id}`} className="text-sm">
                      {group.groupName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignPermissions(false)}>
                Cancel
              </Button>
              <Button onClick={assignPermissionsToUser}>
                Assign Permissions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}