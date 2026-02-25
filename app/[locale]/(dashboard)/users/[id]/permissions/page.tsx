'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Shield, Trash2, Plus, Search } from 'lucide-react';
import { EnterprisePageHeader } from '@/components/shared/EnterprisePageHeader';
import { Loader } from '@/components/ui/loader';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface UserPermission {
  userId: string;
  userName: string;
  email: string;
  groups: Array<{
    id: number;
    name?: string;
    groupName?: string;
  }>;
  effectivePermissions: Array<{
    permissionCode: string;
    permissionName: string;
    source: string;
    orgPermissionId?: number;
  }>;
}

export default function UserPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const [userPermissions, setUserPermissions] = useState<UserPermission | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orgPermissionMap, setOrgPermissionMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchUserPermissions();
    fetchAvailablePermissions();
    fetchOrganizationPermissions();
  }, [params.id]);

  const normalizeEffectivePermissions = (raw: any) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((perm: any) => {
      if (typeof perm === 'string') {
        return {
          permissionCode: perm,
          permissionName: perm,
          source: 'UNKNOWN'
        };
      }
      const permissionCode = perm.permissionCode || perm.code || perm.name || 'UNKNOWN';
      const orgPermissionId =
        typeof perm.orgPermissionId === 'number'
          ? perm.orgPermissionId
          : typeof perm.permissionId === 'number'
            ? perm.permissionId
            : undefined;
      return {
        permissionCode,
        permissionName: perm.permissionName || perm.name || permissionCode,
        source: perm.source || perm.origin || 'UNKNOWN',
        orgPermissionId
      };
    });
  };

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/permissions/users/${params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserPermissions({
          userId: data.userId,
          userName: data.userName,
          email: data.email,
          groups: Array.isArray(data.groups) ? data.groups : [],
          effectivePermissions: normalizeEffectivePermissions(data.effectivePermissions)
        });
        setUserName(data.userName);
      }
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePermissions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permissions/catalog', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailablePermissions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch permissions catalog:', error);
    }
  };

  const fetchOrganizationPermissions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/permissions/organization/permissions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mapping: Record<string, number> = {};
        if (Array.isArray(data)) {
          data.forEach((perm: any) => {
            const code = perm.permissionCode;
            const id = perm.orgPermissionId ?? perm.id;
            if (code && typeof id === 'number') {
              mapping[code] = id;
            }
          });
        }
        setOrgPermissionMap(mapping);
      }
    } catch (error) {
      console.error('Failed to fetch organization permissions:', error);
    }
  };

  const assignCustomPermissions = async () => {
    try {
      await fetch(`http://localhost:8080/api/permissions/users/${params.id}/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ permissions: selectedPermissions })
      });
      setShowAssignDialog(false);
      setSelectedPermissions([]);
      await fetchUserPermissions();
    } catch (error) {
      console.error('Failed to assign permissions:', error);
    }
  };

  const revokePermission = async (permissionCode: string, orgPermissionId?: number) => {
    const resolvedOrgPermissionId = orgPermissionId ?? orgPermissionMap[permissionCode];
    if (!resolvedOrgPermissionId) {
      alert('Missing orgPermissionId for this permission.');
      return;
    }
    if (!confirm(`Remove access to "${permissionCode}" for this user?`)) return;
    
    try {
      await fetch(`http://localhost:8080/api/permissions/users/${params.id}/custom/${resolvedOrgPermissionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      await fetchUserPermissions();
    } catch (error) {
      console.error('Failed to revoke permission:', error);
    }
  };

  const effectivePermissionCodes = new Set(
    (userPermissions?.effectivePermissions || []).map(p => p.permissionCode)
  );
  const formatGroupLabel = (label: string) => {
    return label
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };
  const groupLabel = (() => {
    const raw = (userPermissions?.groups || [])
      .map(g => g.name || g.groupName || '')
      .filter(Boolean);
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const name of raw) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(formatGroupLabel(name));
    }
    return deduped.length > 0 ? deduped.join(', ') : 'Custom';
  })();
  const filteredAvailablePermissions = availablePermissions.filter((permission) => {
    const code = permission.permissionCode || '';
    const name = permission.permissionName || '';
    const matchesSearch = `${code} ${name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotAssigned = !effectivePermissionCodes.has(code);
    return matchesSearch && isNotAssigned;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading permissions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        icon={Shield}
        title={`Manage Permissions - ${userName}`}
        description="Manage user permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/en/dashboard" },
          { label: "Users", href: "/en/users" },
          { label: userName, href: `/en/users/${params.id}/profile` },
          { label: "Permissions" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Permissions
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Effective Permissions ({userPermissions?.effectivePermissions?.length || 0})
          </CardTitle>
          <CardDescription>Assign and revoke custom permissions for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPermissions?.effectivePermissions && userPermissions.effectivePermissions.length > 0 ? (
                  userPermissions.effectivePermissions.map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{permission.permissionName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{permission.permissionCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={permission.source === 'CUSTOM' ? 'default' : 'outline'}>
                          {permission.source === 'CUSTOM' ? 'Custom' : groupLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                          onClick={() => revokePermission(permission.permissionCode, permission.orgPermissionId)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No permissions assigned
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Custom Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-3">
              {filteredAvailablePermissions.map((permission) => (
                <div key={permission.permissionCode} className="flex items-start space-x-2">
                  <Checkbox
                    id={`perm-${permission.permissionCode}`}
                    checked={selectedPermissions.includes(permission.permissionCode)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPermissions([...selectedPermissions, permission.permissionCode]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter(code => code !== permission.permissionCode)
                        );
                      }
                    }}
                  />
                  <label htmlFor={`perm-${permission.permissionCode}`} className="text-sm">
                    <span className="font-medium">{permission.permissionName}</span>
                    <span className="block text-xs text-muted-foreground font-mono">
                      {permission.permissionCode}
                    </span>
                  </label>
                </div>
              ))}
              {filteredAvailablePermissions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No available permissions
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={assignCustomPermissions} disabled={selectedPermissions.length === 0}>
                Assign Permissions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
