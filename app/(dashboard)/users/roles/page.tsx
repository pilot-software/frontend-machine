"use client";

import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle,} from "../../../../components/ui/card";
import {Button} from "../../../../components/ui/button";
import {Badge} from "../../../../components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../../../../components/ui/table";
import {Switch} from "../../../../components/ui/switch";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "../../../../components/ui/dialog";
import {Edit, Settings, Shield, Users} from "lucide-react";
import {apiClient} from "../../../../lib/api";

const ROLES = ["ADMIN", "DOCTOR", "NURSE", "FINANCE", "RECEPTIONIST"];
const MODULES = [
    "Users",
    "Patients",
    "Medical Records",
    "Appointments",
    "Billing",
    "Queues",
];

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
            const promises = ROLES.map((role) => apiClient.getRolePermissions(role));
            const results = await Promise.all(promises);
            setRolePermissions(results.flat());
        } catch (error) {
            console.error("Failed to fetch role permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role: string) => {
        const colors = {
            ADMIN: "bg-red-100 text-red-800",
            DOCTOR: "bg-blue-100 text-blue-800",
            NURSE: "bg-green-100 text-green-800",
            FINANCE: "bg-yellow-100 text-yellow-800",
            RECEPTIONIST: "bg-purple-100 text-purple-800",
        };
        return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    const getDefaultPermissions = (role: string, module: string) => {
        const rolePermissions: Record<string, Record<string, any>> = {
            ADMIN: {create: true, read: true, update: true, delete: true},
            DOCTOR: {
                Users: {create: false, read: true, update: false, delete: false},
                Patients: {create: true, read: true, update: true, delete: false},
                "Medical Records": {
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                },
                Appointments: {create: true, read: true, update: true, delete: false},
                Billing: {create: false, read: true, update: false, delete: false},
                Queues: {create: false, read: true, update: true, delete: false},
            },
            NURSE: {
                Users: {create: false, read: true, update: false, delete: false},
                Patients: {create: true, read: true, update: true, delete: false},
                "Medical Records": {
                    create: true,
                    read: true,
                    update: true,
                    delete: false,
                },
                Appointments: {create: true, read: true, update: true, delete: false},
                Billing: {create: false, read: true, update: false, delete: false},
                Queues: {create: false, read: true, update: true, delete: false},
            },
            FINANCE: {
                Users: {create: false, read: true, update: false, delete: false},
                Patients: {create: false, read: true, update: false, delete: false},
                "Medical Records": {
                    create: false,
                    read: true,
                    update: false,
                    delete: false,
                },
                Appointments: {
                    create: false,
                    read: true,
                    update: false,
                    delete: false,
                },
                Billing: {create: true, read: true, update: true, delete: false},
                Queues: {create: false, read: false, update: false, delete: false},
            },
            RECEPTIONIST: {
                Users: {create: false, read: true, update: false, delete: false},
                Patients: {create: true, read: true, update: true, delete: false},
                "Medical Records": {
                    create: false,
                    read: true,
                    update: false,
                    delete: false,
                },
                Appointments: {create: true, read: true, update: true, delete: false},
                Billing: {create: false, read: true, update: false, delete: false},
                Queues: {create: false, read: true, update: false, delete: false},
            },
        };

        if (role === "ADMIN") {
            return {create: true, read: true, update: true, delete: true};
        }

        return (
            rolePermissions[role]?.[module] || {
                create: false,
                read: false,
                update: false,
                delete: false,
            }
        );
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
                            <Settings className="h-8 w-8 text-blue-600"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Permission Modules
                                </p>
                                <p className="text-2xl font-bold">{MODULES.length}</p>
                            </div>
                            <Shield className="h-8 w-8 text-green-600"/>
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
                            <Users className="h-8 w-8 text-purple-600"/>
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
                                        <Edit className="h-4 w-4 mr-2"/>
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
                                                    <TableCell className="font-medium">
                                                        {module}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={perms.create} disabled/>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={perms.read} disabled/>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={perms.update} disabled/>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={perms.delete} disabled/>
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
                           onSuccess,
                       }: {
    isOpen: boolean;
    onClose: () => void;
    role: string | null;
    onSuccess: () => void;
}) {
    if (!role) return null;

    // Permission shape used in system
    interface Permission {
        id?: string;
        name: string;
        module?: string;
        level?: string;
        description?: string;
    }

    const [allPermissions, setAllPermissions] = React.useState<Permission[]>([]);
    const [assigned, setAssigned] = React.useState<string[]>([]); // store permission names
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    // Load permissions when modal opens
    React.useEffect(() => {
        if (!isOpen || !role) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const [all, rolePerms] = await Promise.all([
                    // get list of all permissions
                    // apiClient.getAllPermissions returns array of permission objects
                    apiClient.getAllPermissions(),
                    // role specific permissions - could be array of strings or objects
                    apiClient.getRolePermissions(role),
                ]);

                if (!mounted) return;

                const normalizedAll: Permission[] = Array.isArray(all)
                    ? all.map((p: any) => ({id: p.id || p.name, name: p.name || p}))
                    : [];

                // rolePerms might be like ['PERM_NAME', ...] or [{ name, ... }, ...]
                const normalizedAssigned: string[] = Array.isArray(rolePerms)
                    ? rolePerms.map((p: any) =>
                        typeof p === "string" ? p : p.name || p.id
                    )
                    : [];

                setAllPermissions(normalizedAll);
                setAssigned(normalizedAssigned.filter(Boolean));
            } catch (err) {
                console.error("Failed loading permissions for role editor", err);
                setAllPermissions([]);
                setAssigned([]);
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [isOpen, role]);

    const handleDragStart = (e: React.DragEvent, permName: string) => {
        e.dataTransfer.setData("text/plain", permName);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDropToAssigned = async (e: React.DragEvent) => {
        e.preventDefault();
        const permName = e.dataTransfer.getData("text/plain");
        if (!permName) return;
        if (assigned.includes(permName)) return;
        const next = [...assigned, permName];
        setAssigned(next);
        await persistRolePermissions(next);
    };

    const handleDropToAvailable = async (e: React.DragEvent) => {
        e.preventDefault();
        const permName = e.dataTransfer.getData("text/plain");
        if (!permName) return;
        if (!assigned.includes(permName)) return;
        const next = assigned.filter((p) => p !== permName);
        setAssigned(next);
        await persistRolePermissions(next);
    };

    const persistRolePermissions = async (permissions: string[]) => {
        if (!role) return;
        setSaving(true);
        try {
            // API expects a body; send { permissions: [...] } to be consistent with other endpoints
            await apiClient.updateRolePermissions(role, {permissions});
            // Refresh parent view
            onSuccess();
        } catch (err) {
            console.error("Failed to update role permissions", err);
        } finally {
            setSaving(false);
        }
    };

    const availablePermissions = allPermissions.filter(
        (p) => !assigned.includes(p.name)
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit {role} Permissions</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        Drag permissions from the left column to assign them to the role.
                        Drag from the right to remove.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Permissions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDropToAvailable}
                                        className="min-h-[200px] border rounded p-2 bg-muted/5 overflow-auto"
                                    >
                                        {loading ? (
                                            <p className="text-center py-6">Loading...</p>
                                        ) : availablePermissions.length === 0 ? (
                                            <p className="text-center py-6">
                                                No permissions available
                                            </p>
                                        ) : (
                                            availablePermissions.map((perm) => (
                                                <div
                                                    key={perm.name}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, perm.name)}
                                                    className="p-2 mb-2 rounded border bg-white cursor-grab"
                                                >
                                                    <div className="font-medium">{perm.name}</div>
                                                    {perm.description && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {perm.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assigned to {role}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDropToAssigned}
                                        className="min-h-[200px] border rounded p-2 bg-muted/5 overflow-auto"
                                    >
                                        {saving && (
                                            <p className="text-sm text-muted-foreground">Saving...</p>
                                        )}
                                        {assigned.length === 0 ? (
                                            <p className="text-center py-6">
                                                No permissions assigned
                                            </p>
                                        ) : (
                                            assigned.map((permName) => {
                                                const permObj = allPermissions.find(
                                                    (p) => p.name === permName
                                                );
                                                return (
                                                    <div
                                                        key={permName}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, permName)}
                                                        className="p-2 mb-2 rounded border bg-white cursor-grab flex justify-between items-start"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {permObj?.name || permName}
                                                            </div>
                                                            {permObj?.description && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {permObj.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={async () => {
                                                                    // quick remove
                                                                    const next = assigned.filter(
                                                                        (p) => p !== permName
                                                                    );
                                                                    setAssigned(next);
                                                                    await persistRolePermissions(next);
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose} className="mr-2">
                            Close
                        </Button>
                        <Button
                            onClick={async () => {
                                // explicit save (in case user wants to adjust multiple then save)
                                await persistRolePermissions(assigned);
                            }}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
