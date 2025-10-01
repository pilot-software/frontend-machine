'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Switch } from '../../../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Settings, Users, Shield, Edit } from 'lucide-react';
import { apiClient } from '../../../../lib/api';

const ROLES = ['ADMIN', 'DOCTOR', 'NURSE', 'FINANCE', 'RECEPTIONIST'];
const MODULES = ['Users', 'Patients', 'Medical Records', 'Appointments', 'Billing', 'Queues'];

interface RolePermission {
  role: string;
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  special: string[];
}

export default function RolesPage() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const fetchRolePermissions = async () => {
    try {
      const promises = ROLES.map(role => apiClient.getRolePermissions(role));
      const results = await Promise.all(promises);
      setRolePermissions(results.flat());
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      DOCTOR: 'bg-blue-100 text-blue-800',
      NURSE: 'bg-green-100 text-green-800',
      FINANCE: 'bg-yellow-100 text-yellow-800',
      RECEPTIONIST: 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDefaultPermissions = (role: string, module: string) => {
    const rolePermissions: Record<string, Record<string, any>> = {
      ADMIN: { create: true, read: true, update: true, delete: true },
      DOCTOR: { 
        Users: { create: false, read: true, update: false, delete: false },
        Patients: { create: true, read: true, update: true, delete: false },
        'Medical Records': { create: true, read: true, update: true, delete: false },
        Appointments: { create: true, read: true, update: true, delete: false },
        Billing: { create: false, read: true, update: false, delete: false },
        Queues: { create: false, read: true, update: true, delete: false }
      },
      NURSE: {
        Users: { create: false, read: true, update: false, delete: false },
        Patients: { create: true, read: true, update: true, delete: false },
        'Medical Records': { create: true, read: true, update: true, delete: false },
        Appointments: { create: true, read: true, update: true, delete: false },
        Billing: { create: false, read: true, update: false, delete: false },
        Queues: { create: false, read: true, update: true, delete: false }
      },
      FINANCE: {
        Users: { create: false, read: true, update: false, delete: false },
        Patients: { create: false, read: true, update: false, delete: false },
        'Medical Records': { create: false, read: true, update: false, delete: false },
        Appointments: { create: false, read: true, update: false, delete: false },
        Billing: { create: true, read: true, update: true, delete: false },
        Queues: { create: false, read: false, update: false, delete: false }
      },
      RECEPTIONIST: {
        Users: { create: false, read: true, update: false, delete: false },
        Patients: { create: true, read: true, update: true, delete: false },
        'Medical Records': { create: false, read: true, update: false, delete: false },
        Appointments: { create: true, read: true, update: true, delete: false },
        Billing: { create: false, read: true, update: false, delete: false },
        Queues: { create: false, read: true, update: false, delete: false }
      }
    };

    if (role === 'ADMIN') {
      return { create: true, read: true, update: true, delete: true };
    }

    return rolePermissions[role]?.[module] || { create: false, read: false, update: false, delete: false };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold">{ROLES.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Permission Modules</p>
                <p className="text-2xl font-bold">{MODULES.length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custom Roles</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ROLES.map((role) => (
              <div key={role} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(role)}>{role}</Badge>
                    <span className="font-medium">{role} Permissions</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead className="text-center">Create</TableHead>
                      <TableHead className="text-center">Read</TableHead>
                      <TableHead className="text-center">Update</TableHead>
                      <TableHead className="text-center">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MODULES.map((module) => {
                      const perms = getDefaultPermissions(role, module);
                      return (
                        <TableRow key={module}>
                          <TableCell className="font-medium">{module}</TableCell>
                          <TableCell className="text-center">
                            <Switch checked={perms.create} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={perms.read} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={perms.update} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch checked={perms.delete} disabled />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RoleEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        role={selectedRole}
        onSuccess={fetchRolePermissions}
      />
    </div>
  );
}

function RoleEditModal({ 
  isOpen, 
  onClose, 
  role, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  role: string | null;
  onSuccess: () => void;
}) {
  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {role} Permissions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Role permission editing will be available in the next update.
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}