'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {ArrowLeft, Clock, Minus, Plus, Save, Shield} from 'lucide-react';
import {api} from '@/lib/api';
import {TemporaryPermissionModal} from '@/components/permissions/TemporaryPermissionModal';

const PERMISSION_MODULES = [
    {name: 'Users', key: 'users', special: ['Manage Roles', 'Delete Users']},
    {name: 'Patients', key: 'patients', special: ['Assign Doctor', 'Delete Records']},
    {name: 'Medical Records', key: 'medical_records', special: ['Approve Report', 'Edit History']},
    {name: 'Appointments', key: 'appointments', special: ['Cancel Any', 'Reschedule']},
    {name: 'Billing', key: 'billing', special: ['Process Payment', 'Refunds']},
    {name: 'Queues', key: 'queues', special: ['Manage All', 'Priority Override']}
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
    const [_loading, setLoading] = useState(true);
    const [showTempPermModal, setShowTempPermModal] = useState(false);

    useEffect(() => {
        fetchUserPermissions();
    }, [params.id]);

    const fetchUserPermissions = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/api/permissions/user/${params.id}`);
            const permList = data.permissions || [];
            const formattedPerms = PERMISSION_MODULES.map(module => ({
                module: module.key,
                create: permList.includes(`${module.key.toUpperCase()}_CREATE`),
                read: permList.includes(`${module.key.toUpperCase()}_VIEW`),
                update: permList.includes(`${module.key.toUpperCase()}_UPDATE`),
                delete: permList.includes(`${module.key.toUpperCase()}_DELETE`),
                special: []
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
            const permissionsList: string[] = [];
            permissions.forEach(perm => {
                if (perm.create) permissionsList.push(`${perm.module.toUpperCase()}_CREATE`);
                if (perm.read) permissionsList.push(`${perm.module.toUpperCase()}_VIEW`);
                if (perm.update) permissionsList.push(`${perm.module.toUpperCase()}_UPDATE`);
                if (perm.delete) permissionsList.push(`${perm.module.toUpperCase()}_DELETE`);
            });
            await api.put(`/api/permissions/user/${params.id}`, {
                permissions: permissionsList,
                groups: [],
                branchPermissions: {}
            });
        } catch (error) {
            console.error('Failed to save permissions:', error);
        }
    };

    const updatePermission = (moduleKey: string, type: keyof Permission, value: boolean | string[]) => {
        setPermissions(prev => prev.map(perm =>
            perm.module === moduleKey ? {...perm, [type]: value} : perm
        ));
    };

    const toggleSpecialPermission = (moduleKey: string, specialPerm: string) => {
        setPermissions(prev => prev.map(perm => {
            if (perm.module === moduleKey) {
                const newSpecial = perm.special.includes(specialPerm)
                    ? perm.special.filter(s => s !== specialPerm)
                    : [...perm.special, specialPerm];
                return {...perm, special: newSpecial};
            }
            return perm;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">User Permissions</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/permissions/audit')}>
                        View Audit Log
                    </Button>
                    <Button variant="outline" onClick={() => setShowTempPermModal(true)}
                            className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        Grant Temporary
                    </Button>
                    <Button className="flex items-center gap-2" onClick={savePermissions}>
                        <Save className="h-4 w-4"/>
                        Save Changes
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5"/>
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
                                                onCheckedChange={(checked: boolean) => updatePermission(module.key, 'create', checked)}
                                            />
                                            <Label htmlFor={`${module.key}-create`}>Create</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`${module.key}-read`}
                                                checked={perm.read}
                                                onCheckedChange={(checked: boolean) => updatePermission(module.key, 'read', checked)}
                                            />
                                            <Label htmlFor={`${module.key}-read`}>Read</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`${module.key}-update`}
                                                checked={perm.update}
                                                onCheckedChange={(checked: boolean) => updatePermission(module.key, 'update', checked)}
                                            />
                                            <Label htmlFor={`${module.key}-update`}>Update</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`${module.key}-delete`}
                                                checked={perm.delete}
                                                onCheckedChange={(checked: boolean) => updatePermission(module.key, 'delete', checked)}
                                            />
                                            <Label htmlFor={`${module.key}-delete`}>Delete</Label>
                                        </div>
                                    </div>

                                    {module.special.length > 0 && (
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">Special
                                                Permissions</Label>
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
                                                            <Minus className="h-3 w-3"/>
                                                        ) : (
                                                            <Plus className="h-3 w-3"/>
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
