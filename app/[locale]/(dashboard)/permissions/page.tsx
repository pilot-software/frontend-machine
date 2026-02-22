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
  rootPermissionId: number;
  orgPermissionId: number;
  permissionCode: string;
  permissionName: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
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
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [allCatalogPermissions, setAllCatalogPermissions] = useState<any[]>([]);
  
  // Modal states
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAssignPermissions, setShowAssignPermissions] = useState(false);
  const [showCreatePermission, setShowCreatePermission] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  
  // Form states
  const [newGroup, setNewGroup] = useState({ name: '', description: '', permissions: [] as string[] });
  const [newPermission, setNewPermission] = useState({ permissionCode: '', permissionName: '', description: '', category: 'CUSTOM' });
  const [assignmentData, setAssignmentData] = useState({ groupIds: [] as number[], customPermissions: [] as string[] });

  // Reset selectedUser when modal opens
  const handleShowAssignPermissions = () => {
    setSelectedUser('');
    setAssignmentData({ groupIds: [], customPermissions: [] });
    setShowAssignPermissions(true);
  };

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
        loadAvailableUsers(),
        loadAllCatalogPermissions()
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



  const loadAllCatalogPermissions = async () => {
    try {
      const response = await fetch('/api/permissions/catalog', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAllCatalogPermissions(data);
      }
    } catch (error) {
      console.error('Failed to load catalog permissions:', error);
    }
  };

  const loadPermissionGroups = async () => {
    try {
      const response = await fetch('/api/permissions/groups', {
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

  const loadUserPermissions = async (userId: string) => {
    try {
      const response = await fetch(`/api/permissions/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUserPermissions(data);
      }
    } catch (error) {
      console.error('Failed to load user permissions:', error);
      setSelectedUserPermissions(null);
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUser(userId);
    if (userId) {
      loadUserPermissions(userId);
    } else {
      setSelectedUserPermissions(null);
    }
  };
  const loadAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const users = await response.json();
        console.log('Users from API:', users[0]); // Debug log
        setAvailableUsers(users.map((user: any) => ({
          id: user.userId || user.id,
          name: user.name || user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
          email: user.email
        })));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/audit/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          organizationId: 'hospital_org1',
          entityType: 'PERMISSION_GROUP',
          page: 0,
          size: 20
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.content || data);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const createSystemPermission = async () => {
    try {
      const response = await fetch('/api/permissions/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(newPermission)
      });
      
      if (response.ok) {
        await dispatch(fetchPermissionCatalog());
        setShowCreatePermission(false);
        setNewPermission({ permissionCode: '', permissionName: '', description: '', category: 'CUSTOM' });
      }
    } catch (error) {
      console.error('Failed to create system permission:', error);
    }
  };

  const createPermissionGroup = async () => {
    try {
      console.log('Selected permissions:', newGroup.permissions);
      console.log('Organization permissions:', organizationPermissions);
      console.log('First org permission structure:', organizationPermissions[0]);
      
      if (newGroup.permissions.length === 0) {
        console.warn('No permissions selected');
        return;
      }
      
      if (organizationPermissions.length === 0) {
        console.error('Organization permissions not loaded');
        return;
      }
      
      // Map permission codes to organization permission IDs
      const orgPermissionIds = newGroup.permissions.map(permCode => {
        const orgPerm = organizationPermissions.find(p => p.permissionCode === permCode);
        console.log(`Mapping ${permCode} to ID:`, orgPerm?.orgPermissionId);
        return orgPerm?.orgPermissionId;
      }).filter(id => id !== undefined);

      console.log('Final org permission IDs:', orgPermissionIds);
      
      if (orgPermissionIds.length === 0) {
        console.error('No valid organization permission IDs found');
        return;
      }

      const response = await fetch('/api/permissions/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          groupName: newGroup.name,
          description: newGroup.description,
          permissionIds: orgPermissionIds
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

  const deletePermissionGroup = async (groupId: number) => {
    try {
      const response = await fetch(`/api/permissions/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        await loadPermissionGroups();
      }
    } catch (error) {
      console.error('Failed to delete permission group:', error);
    }
  };

  const updatePermissionGroup = async (groupId: number, updates: any) => {
    try {
      const response = await fetch(`/api/permissions/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        await loadPermissionGroups();
      }
    } catch (error) {
      console.error('Failed to update permission group:', error);
    }
  };

  const assignPermissionsToUser = async () => {
    if (!selectedUser) return;
    
    console.log('Assigning permissions to user:', selectedUser);
    
    try {
      if (assignmentData.groupIds.length > 0) {
        await fetch(`/api/permissions/users/${selectedUser}/groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({ groupIds: assignmentData.groupIds })
        });
      }
      
      if (assignmentData.customPermissions.length > 0) {
        await fetch(`/api/permissions/users/${selectedUser}/custom`, {
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
      setSelectedUser('');
    } catch (error) {
      // Ignore duplicate key errors - groups already assigned
      if (error instanceof Error && error.message.includes('duplicate key')) {
        console.log('Some groups were already assigned to user');
      } else {
        console.error('Failed to assign permissions:', error);
      }
      setShowAssignPermissions(false);
      setAssignmentData({ groupIds: [], customPermissions: [] });
      setSelectedUser('');
    }
  };

  const toggleOrganizationPermission = async (permissionId: number, isEnabled: boolean) => {
    try {
      await fetch(`/api/permissions/organization/permissions/${permissionId}/toggle`, {
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

  const assignPermissionToOrg = async (rootPermissionId: number) => {
    try {
      const response = await fetch(`/api/permissions/catalog/${rootPermissionId}/distribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          organizationIds: ['hospital_org1']
        })
      });
      
      if (response.ok) {
        alert('Permission assigned successfully!');
        await dispatch(fetchOrganizationPermissions());
        await loadAllCatalogPermissions();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to assign permission'}`);
      }
    } catch (error) {
      alert('Error: Failed to assign permission to organization');
    }
  };

  // Get filtered permissions for catalog
  const getFilteredCatalogPermissions = () => {
    if (catalogFilter === 'assigned') {
      return allCatalogPermissions.filter(catalogPerm => 
        organizationPermissions.find(orgPerm => orgPerm.rootPermissionId === catalogPerm.rootPermissionId)
      );
    } else if (catalogFilter === 'unassigned') {
      return unassignedPermissions;
    }
    return allCatalogPermissions;
  };

  const filteredCatalogPermissions = getFilteredCatalogPermissions();
  const groupedFilteredCatalogPermissions = filteredCatalogPermissions.reduce((acc, perm) => {
    const category = perm.permissionCode.split('_')[0] || 'GENERAL';
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, any[]>);

  // Get unassigned permissions for catalog
  const unassignedPermissions = allCatalogPermissions.filter(catalogPerm => 
    !organizationPermissions.find(orgPerm => orgPerm.rootPermissionId === catalogPerm.rootPermissionId)
  );

  const groupedUnassignedPermissions = unassignedPermissions.reduce((acc, perm) => {
    const category = perm.permissionCode.split('_')[0] || 'GENERAL';
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, any[]>);

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
    { id: "catalog" as PermissionSection, label: "Permission Catalog", icon: Shield },
    { id: "settings" as PermissionSection, label: "Organization Permissions", icon: Settings },
    { id: "groups" as PermissionSection, label: "Permission Groups", icon: Users },
    { id: "users" as PermissionSection, label: "User Permissions", icon: UserCog },
    { id: "audit" as PermissionSection, label: "Audit", icon: FileText },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Permissions Management</h2>
          <p className="text-muted-foreground mt-2">Manage system permissions, roles, and user access control</p>
        </div>
        <Button onClick={() => setShowCreateGroup(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Horizontal Tabs */}
      <div className="border-b border-border bg-card rounded-lg">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide p-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all whitespace-nowrap text-sm font-medium ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">System Permissions</p>
                      <h3 className="text-3xl font-bold mt-2">{allCatalogPermissions.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned Permissions</p>
                      <h3 className="text-3xl font-bold mt-2">{organizationPermissions.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Permission Groups</p>
                      <h3 className="text-3xl font-bold mt-2">{permissionGroups.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <h3 className="text-3xl font-bold mt-2">{availableUsers.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest permission changes and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.length > 0 ? auditLogs.slice(0, 5).map((log) => (
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
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                        <p className="text-xs">Permission changes will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common permission management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-3 hover:bg-accent hover:border-primary transition-all"
                      onClick={() => setShowCreateGroup(true)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Create Permission Group</div>
                        <div className="text-xs text-muted-foreground">Bundle permissions for roles</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-3 hover:bg-accent hover:border-primary transition-all"
                      onClick={handleShowAssignPermissions}
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center mr-3">
                        <UserCog className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Assign User Permissions</div>
                        <div className="text-xs text-muted-foreground">Grant access to users</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-3 hover:bg-accent hover:border-primary transition-all"
                      onClick={() => setActiveSection('catalog')}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Browse Permission Catalog</div>
                        <div className="text-xs text-muted-foreground">Explore available permissions</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Permission Catalog */}
        {activeSection === "catalog" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permission Catalog ({filteredCatalogPermissions.length})
              </CardTitle>
              <CardDescription>Browse and assign system permissions to your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={catalogFilter} onValueChange={(value: 'all' | 'assigned' | 'unassigned') => setCatalogFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({allCatalogPermissions.length})</SelectItem>
                    <SelectItem value="assigned">Assigned ({organizationPermissions.length})</SelectItem>
                    <SelectItem value="unassigned">Unassigned ({unassignedPermissions.length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(groupedFilteredCatalogPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm">{category.replace('_', ' ')}</h4>
                    <div className="space-y-2">
                      {permissions.filter(p => 
                        p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((permission, index) => {
                        const isAssigned = organizationPermissions.find(op => op.rootPermissionId === permission.rootPermissionId);
                        return (
                          <div key={`${category}-${permission.rootPermissionId || permission.permissionCode || index}`} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{permission.permissionName}</p>
                              <p className="text-xs text-muted-foreground">{permission.permissionCode}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={isAssigned ? "default" : "outline"}>
                                {isAssigned ? "Assigned" : "Available"}
                              </Badge>
                              {!isAssigned && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('Full permission object:', JSON.stringify(permission, null, 2));
                                    console.log('rootPermissionId:', permission.rootPermissionId);
                                    console.log('typeof rootPermissionId:', typeof permission.rootPermissionId);
                                    assignPermissionToOrg(permission.rootPermissionId);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permission Groups */}
        {activeSection === "groups" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Permission Groups ({filteredGroups.length})
              </CardTitle>
              <CardDescription>Create and manage permission groups for role-based access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowCreateGroup(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{group.groupName}</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(group)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${group.groupName}"?`)) {
                              deletePermissionGroup(group.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                    
                    {/* Show permissions in group */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {group.permissions && group.permissions.length > 0 ? (
                          group.permissions.slice(0, 3).map((permission, index) => {
                            // Handle both string and object formats
                            const permCode = typeof permission === 'string' ? permission : permission.permissionCode;
                            const permName = typeof permission === 'string' 
                              ? organizationPermissions.find(p => p.permissionCode === permission)?.permissionName || permission
                              : permission.permissionName || permission.permissionCode;
                            
                            return (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permName}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs text-muted-foreground">No permissions</span>
                        )}
                        {group.permissions && group.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{group.permissions?.length || 0} permissions</Badge>
                      <span className="text-xs text-muted-foreground">
                        0 users
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Permissions */}
        {activeSection === "users" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Permissions
              </CardTitle>
              <CardDescription>Assign permission groups and manage individual user access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Select User</Label>
                  <Select value={selectedUser} onValueChange={handleUserSelection}>
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
              {selectedUserPermissions && (
                <div className="mt-6">
                  <Label className="text-sm font-medium mb-3 block">Current Effective Permissions</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUserPermissions.effectivePermissions?.map((permission: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{permission.permissionName || permission}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {permission.source || 'Group'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">Active</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!selectedUserPermissions.effectivePermissions || selectedUserPermissions.effectivePermissions.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                              No permissions assigned
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              <Button onClick={assignPermissionsToUser} disabled={!selectedUser || assignmentData.groupIds.length === 0}>
                <UserCog className="h-4 w-4 mr-2" />
                Assign Groups to User
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Audit */}
        {activeSection === "audit" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>Track all permission changes and security events for compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none">
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

        {/* Organization Permissions */}
        {activeSection === "settings" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Organization Permissions ({organizationPermissions.length})
              </CardTitle>
              <CardDescription>Manage permissions assigned to your organization and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm">{category.replace('_', ' ')}</h4>
                    <div className="space-y-2">
                      {permissions.filter(p => 
                        p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((permission, index) => (
                        <div key={`${category}-${permission.orgPermissionId || permission.permissionCode || index}`} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{permission.permissionName}</p>
                            <p className="text-xs text-muted-foreground">{permission.permissionCode}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={permission.isActive ? "default" : "secondary"}>
                              {permission.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button 
                              variant={permission.isActive ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleOrganizationPermission(permission.orgPermissionId, !permission.isActive)}
                            >
                              {permission.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
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