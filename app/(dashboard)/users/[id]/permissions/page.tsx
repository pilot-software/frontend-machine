'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '../../../../../components/ui/card';
import {Button} from '../../../../../components/ui/button';
import {Switch} from '../../../../../components/ui/switch';
import {Label} from '../../../../../components/ui/label';
import {Badge} from '../../../../../components/ui/badge';
import {ArrowLeft, Clock, Minus, Plus, Save, Shield} from 'lucide-react';
import {api} from '../../../../../lib/api';
import {TemporaryPermissionModal} from '../../../../../components/permissions';

const PERMISSION_MODULES = [
  { name: 'Users', key: 'users', special: ['Manage Roles', 'Delete Users'] },
  { name: 'Patients', key: 'patients', special: ['Assign Doctor', 'Delete Records'] },
  { name: 'Medical Records', key: 'medical_records', special: ['Approve Report', 'Edit History'] },
  { name: 'Appointments', key: 'appointments', special: ['Cancel Any', 'Reschedule'] },
  { name: 'Billing', key: 'billing', special: ['Process Payment', 'Refunds'] },
  { name: 'Queues', key: 'queues', special: ['Manage All', 'Priority Override'] }
];

interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  special: string[];
}

export default function UserPermissionsPage() {
  const router = useRouter();
  const params = useParams();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTempPermModal, setShowTempPermModal] = useState(false);

  useEffect(() => {
    fetchUserPermissions();
  }, [params.id]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const userPerms = await api.get(`/api/users/${params.id}/permissions/effective`);
      const formattedPerms = PERMISSION_MODULES.map(module => ({
        module: module.key,
        create: userPerms[`${module.key}.create`] || false,
        read: userPerms[`${module.key}.read`] || false,
        update: userPerms[`${module.key}.update`] || false,
        delete: userPerms[`${module.key}.delete`] || false,
        special: module.special.filter(sp => userPerms[`${module.key}.${sp.toLowerCase().replace(' ', '_')}`])
      }));
      setPermissions(formattedPerms);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePermissions = async () => {
    try {
      const permissionData: Record<string, boolean> = {};
      permissions.forEach(perm => {
        permissionData[`${perm.module}.create`] = perm.create;
        permissionData[`${perm.module}.read`] = perm.read;
        permissionData[`${perm.module}.update`] = perm.update;
        permissionData[`${perm.module}.delete`] = perm.delete;
        perm.special.forEach(sp => {
          permissionData[`${perm.module}.${sp.toLowerCase().replace(' ', '_')}`] = true;
        });
      });
      await api.post(`/api/users/${params.id}/permissions/override`, permissionData);
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  };

  const updatePermission = (moduleKey: string, type: keyof Permission, value: boolean | string[]) => {
    setPermissions(prev => prev.map(perm =>
      perm.module === moduleKey ? { ...perm, [type]: value } : perm
    ));
  };

  const toggleSpecialPermission = (moduleKey: string, specialPerm: string) => {
    setPermissions(prev => prev.map(perm => {
      if (perm.module === moduleKey) {
        const newSpecial = perm.special.includes(specialPerm)
          ? perm.special.filter(s => s !== specialPerm)
          : [...perm.special, specialPerm];
        return { ...perm, special: newSpecial };
      }
      return perm;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/users/${params.id}/profile`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Permissions</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/permissions/audit')}>
            View Audit Log
          </Button>
          <Button variant="outline" onClick={() => setShowTempPermModal(true)} className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Grant Temporary
          </Button>
          <Button className="flex items-center gap-2" onClick={savePermissions}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PERMISSION_MODULES.map((module) => {
              const perm = permissions.find(p => p.module === module.key);
              if (!perm) return null;

              return (
                <div key={module.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{module.name}</h3>
                    <Badge variant="outline">{module.key}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${module.key}-create`}
                        checked={perm.create}
                        onCheckedChange={(checked) => updatePermission(module.key, 'create', checked)}
                      />
                      <Label htmlFor={`${module.key}-create`}>Create</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${module.key}-read`}
                        checked={perm.read}
                        onCheckedChange={(checked) => updatePermission(module.key, 'read', checked)}
                      />
                      <Label htmlFor={`${module.key}-read`}>Read</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${module.key}-update`}
                        checked={perm.update}
                        onCheckedChange={(checked) => updatePermission(module.key, 'update', checked)}
                      />
                      <Label htmlFor={`${module.key}-update`}>Update</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${module.key}-delete`}
                        checked={perm.delete}
                        onCheckedChange={(checked) => updatePermission(module.key, 'delete', checked)}
                      />
                      <Label htmlFor={`${module.key}-delete`}>Delete</Label>
                    </div>
                  </div>

                  {module.special.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Special Permissions</Label>
                      <div className="flex flex-wrap gap-2">
                        {module.special.map((specialPerm) => (
                          <Button
                            key={specialPerm}
                            variant={perm.special.includes(specialPerm) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSpecialPermission(module.key, specialPerm)}
                            className="flex items-center gap-1"
                          >
                            {perm.special.includes(specialPerm) ? (
                              <Minus className="h-3 w-3" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                            {specialPerm}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <TemporaryPermissionModal
        isOpen={showTempPermModal}
        onClose={() => setShowTempPermModal(false)}
        userId={params.id as string}
        onSuccess={() => {
          // Optionally refresh permissions or show success message
          console.log('Temporary permission granted successfully');
        }}
      />
    </div>
  );
}
