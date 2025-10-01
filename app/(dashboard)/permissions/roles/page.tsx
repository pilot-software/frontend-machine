'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { ArrowLeft, Save, Shield, GripVertical, Users, Settings } from 'lucide-react';
import { api } from '../../../../lib/api';

const ROLES = [
  { key: 'ADMIN', name: 'Administrator', color: 'bg-red-100 text-red-800' },
  { key: 'DOCTOR', name: 'Doctor', color: 'bg-blue-100 text-blue-800' },
  { key: 'NURSE', name: 'Nurse', color: 'bg-green-100 text-green-800' },
  { key: 'PATIENT', name: 'Patient', color: 'bg-purple-100 text-purple-800' },
  { key: 'RECEPTIONIST', name: 'Receptionist', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'TECHNICIAN', name: 'Technician', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'FINANCE', name: 'Finance', color: 'bg-orange-100 text-orange-800' }
];



export default function RolePermissionsPage() {
  const router = useRouter();
  const [rolePermissions, setRolePermissions] = useState({});
  const [roleGroups, setRoleGroups] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, item: null });
  const [viewMode, setViewMode] = useState('groups'); // 'groups' or 'permissions'

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, permission: null });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchRolePermissions = async () => {
    try {
      setLoading(true);
      
      // Fetch all available permissions and groups
      const allPermsResponse = await api.get('/api/permissions/all');
      const allPerms = allPermsResponse?.permissions || [];
      setAllPermissions(allPerms);
      
      const groupsResponse = await api.get('/api/permissions/groups');
      const groupNames = groupsResponse || [];
      setAllGroups(groupNames);
      
      const permissions = {};
      const groups = {};
      
      // Initialize role arrays
      for (const role of ROLES) {
        permissions[role.key] = [];
        groups[role.key] = [];
      }
      
      // Fetch individual group details to see which roles they belong to
      for (const groupName of groupNames) {
        try {
          const groupDetails = await api.get(`/api/permissions/groups/${groupName}`);
          if (groupDetails && groupDetails.roles) {
            // Add this group to each role that uses it
            groupDetails.roles.forEach(roleName => {
              if (groups[roleName]) {
                groups[roleName].push(groupName);
              }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch details for group ${groupName}:`, error);
        }
      }
      
      // Fetch role permissions (fallback)
      for (const role of ROLES) {
        try {
          const rolePerms = await api.get(`/api/permissions/role/${role.key}`);
          permissions[role.key] = rolePerms?.permissions || [];
        } catch (error) {
          console.error(`Failed to fetch permissions for role ${role.key}:`, error);
        }
      }
      
      setRolePermissions(permissions);
      setRoleGroups(groups);
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRolePermissions = async () => {
    try {
      for (const role of ROLES) {
        // Save groups (primary)
        if (roleGroups[role.key]?.length > 0) {
          await api.put(`/api/permissions/role/${role.key}/groups`, {
            groups: roleGroups[role.key]
          });
        }
        
        // Save individual permissions (fallback)
        await api.put(`/api/permissions/role/${role.key}`, {
          permissions: rolePermissions[role.key] || []
        });
      }
    } catch (error) {
      console.error('Failed to save role permissions:', error);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, roleKey) => {
    e.preventDefault();
    if (draggedItem) {
      if (viewMode === 'groups') {
        const newGroups = { ...roleGroups };
        if (!newGroups[roleKey]) newGroups[roleKey] = [];
        if (!newGroups[roleKey].includes(draggedItem)) {
          newGroups[roleKey] = [...newGroups[roleKey], draggedItem];
        }
        setRoleGroups(newGroups);
      } else {
        const newPermissions = { ...rolePermissions };
        if (!newPermissions[roleKey]) newPermissions[roleKey] = [];
        if (!newPermissions[roleKey].includes(draggedItem)) {
          newPermissions[roleKey] = [...newPermissions[roleKey], draggedItem];
        }
        setRolePermissions(newPermissions);
      }
      setDraggedItem(null);
    }
  };

  const removeItem = (roleKey, item) => {
    if (viewMode === 'groups') {
      const newGroups = { ...roleGroups };
      newGroups[roleKey] = newGroups[roleKey].filter(g => g !== item);
      setRoleGroups(newGroups);
    } else {
      const newPermissions = { ...rolePermissions };
      newPermissions[roleKey] = newPermissions[roleKey].filter(p => p !== item);
      setRolePermissions(newPermissions);
    }
  };

  const assignToRole = (roleKey, item) => {
    if (viewMode === 'groups') {
      const newGroups = { ...roleGroups };
      if (!newGroups[roleKey].includes(item)) {
        newGroups[roleKey] = [...newGroups[roleKey], item];
        setRoleGroups(newGroups);
      }
    } else {
      const newPermissions = { ...rolePermissions };
      if (!newPermissions[roleKey].includes(item)) {
        newPermissions[roleKey] = [...newPermissions[roleKey], item];
        setRolePermissions(newPermissions);
      }
    }
    setContextMenu({ show: false, x: 0, y: 0, item: null });
  };

  const handleRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      item
    });
  };



  if (loading) {
    return <div className="p-6">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="fixed bg-white border shadow-lg rounded-md py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="px-3 py-1 text-xs text-gray-500 border-b">
            Assign to role:
          </div>
          {ROLES.map(role => (
            <button
              key={role.key}
              onClick={() => assignToRole(role.key, contextMenu.item)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {role.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/permissions/overview')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Role Permission Matrix</h1>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'groups' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('groups')}
            >
              <Users className="h-4 w-4 mr-2" />
              Groups
            </Button>
            <Button 
              variant={viewMode === 'permissions' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('permissions')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Permissions
            </Button>
          </div>
        </div>
        <Button className="flex items-center gap-2" onClick={saveRolePermissions}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Available Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Available {viewMode === 'groups' ? 'Permission Groups' : 'Permissions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {viewMode === 'groups' ? (
                Array.isArray(allGroups) ? allGroups.map(group => (
                  <div
                    key={group}
                    draggable
                    onDragStart={(e) => handleDragStart(e, group)}
                    onContextMenu={(e) => handleRightClick(e, group)}
                    className="flex items-center gap-2 p-2 bg-green-50 rounded cursor-move hover:bg-green-100"
                  >
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{group}</span>
                  </div>
                )) : null
              ) : (
                Array.isArray(allPermissions) ? allPermissions.map(permission => (
                  <div
                    key={permission}
                    draggable
                    onDragStart={(e) => handleDragStart(e, permission)}
                    onContextMenu={(e) => handleRightClick(e, permission)}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{permission}</span>
                  </div>
                )) : null
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Columns */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ROLES.map(role => (
            <Card
              key={role.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, role.key)}
              className="min-h-[400px]"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Badge className={role.color}>{role.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {viewMode === 'groups' ? (
                    (roleGroups[role.key] || []).map(group => (
                      <div
                        key={group}
                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{group}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(role.key, group)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  ) : (
                    (rolePermissions[role.key] || []).map(permission => (
                      <div
                        key={permission}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded"
                      >
                        <span className="text-sm">{permission}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(role.key, permission)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  )}
                  {((viewMode === 'groups' ? roleGroups[role.key] : rolePermissions[role.key]) || []).length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      Drop {viewMode === 'groups' ? 'groups' : 'permissions'} here
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}