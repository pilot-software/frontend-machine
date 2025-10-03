"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle,} from "../../../../components/ui/card";
import {Button} from "../../../../components/ui/button";
import {Badge} from "../../../../components/ui/badge";
import {ArrowLeft, GripVertical, Save, Settings, Shield, Users,} from "lucide-react";
import {api} from "../../../../lib/api";
import {toast} from "sonner";
import {useResponsive} from "../../../../lib/hooks/useResponsive";

const ROLES = [
    {key: "ADMIN", name: "Administrator", color: "bg-red-100 text-red-800"},
    {key: "DOCTOR", name: "Doctor", color: "bg-blue-100 text-blue-800"},
    {key: "NURSE", name: "Nurse", color: "bg-green-100 text-green-800"},
    {key: "PATIENT", name: "Patient", color: "bg-purple-100 text-purple-800"},
    {
        key: "RECEPTIONIST",
        name: "Receptionist",
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        key: "TECHNICIAN",
        name: "Technician",
        color: "bg-indigo-100 text-indigo-800",
    },
    {key: "FINANCE", name: "Finance", color: "bg-orange-100 text-orange-800"},
];

export default function RolePermissionsPage() {
    const router = useRouter();
    const {isMobile} = useResponsive();
    const [rolePermissions, setRolePermissions] = useState<
        Record<string, string[]>
    >({} as Record<string, string[]>);
    const [roleGroups, setRoleGroups] = useState<Record<string, string[]>>(
        {} as Record<string, string[]>
    );
    const [initialRolePermissions, setInitialRolePermissions] = useState<
        Record<string, string[]>
    >({} as Record<string, string[]>);
    const [initialRoleGroups, setInitialRoleGroups] = useState<
        Record<string, string[]>
    >({} as Record<string, string[]>);
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [allGroups, setAllGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        show: boolean;
        x: number;
        y: number;
        item: string | null;
    }>({show: false, x: 0, y: 0, item: null});
    const [viewMode, setViewMode] = useState("groups"); // 'groups' or 'permissions'
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [mobileAssignItem, setMobileAssignItem] = useState<string | null>(null);

    useEffect(() => {
        fetchRolePermissions();
    }, []);

    useEffect(() => {
        const handleClick = () =>
            setContextMenu({show: false, x: 0, y: 0, item: null});
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const fetchRolePermissions = async () => {
        try {
            setLoading(true);

            // Fetch all available permissions and groups
            const allPermsResponse = await api.get("/api/permissions/all");
            const allPerms = allPermsResponse?.permissions || [];
            setAllPermissions(allPerms);

            const groupsResponse = await api.get("/api/permissions/groups");
            const groupNames = groupsResponse || [];
            setAllGroups(groupNames);

            const permissions: Record<string, string[]> = {} as Record<
                string,
                string[]
            >;
            const groups: Record<string, string[]> = {} as Record<string, string[]>;

            // Initialize role arrays
            for (const role of ROLES) {
                permissions[role.key] = [];
                groups[role.key] = [];
            }

            // For each role, fetch groups assigned to that role from the role-specific endpoint
            for (const role of ROLES) {
                try {
                    const roleGroupsResp = await api.get(
                        `/api/permissions/role/${role.key}/groups`
                    );
                    // endpoint may return array OR { groups: [...], role: 'ROLE_KEY' }
                    const respGroups = Array.isArray(roleGroupsResp)
                        ? roleGroupsResp
                        : roleGroupsResp?.groups || [];
                    const respRoleKey =
                        roleGroupsResp && roleGroupsResp.role
                            ? roleGroupsResp.role
                            : role.key;
                    // ensure we map to the returned role key when available
                    groups[respRoleKey] = respGroups;
                } catch (error) {
                    console.error(`Failed to fetch groups for role ${role.key}:`, error);
                    groups[role.key] = [];
                }

                // Also fetch explicit role permissions as fallback
                try {
                    const rolePerms = await api.get(`/api/permissions/role/${role.key}`);
                    permissions[role.key] = rolePerms?.permissions || [];
                } catch (error) {
                    console.error(
                        `Failed to fetch permissions for role ${role.key}:`,
                        error
                    );
                    permissions[role.key] = [];
                }
            }

            setRolePermissions(permissions);
            setRoleGroups(groups);
            // keep initial snapshot for change detection
            setInitialRolePermissions(permissions);
            setInitialRoleGroups(groups);
        } catch (error) {
            console.error("Failed to fetch role permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveRolePermissions = async () => {
        try {
            setSaving(true);
            setSaveError(null);

            // Only send updates for roles that changed
            const changedRoles: string[] = [];

            for (const role of ROLES) {
                const key = role.key;
                if (viewMode === "groups") {
                    const current = (roleGroups[key] || []).slice().sort();
                    const initial = (initialRoleGroups[key] || []).slice().sort();
                    if (JSON.stringify(current) !== JSON.stringify(initial)) {
                        changedRoles.push(key);
                    }
                } else {
                    const current = (rolePermissions[key] || []).slice().sort();
                    const initial = (initialRolePermissions[key] || []).slice().sort();
                    if (JSON.stringify(current) !== JSON.stringify(initial)) {
                        changedRoles.push(key);
                    }
                }
            }

            if (changedRoles.length === 0) {
                toast.success("No changes to save");
                return;
            }

            for (const roleKey of changedRoles) {
                if (viewMode === "groups") {
                    await api.put(
                        `/api/permissions/role/${roleKey}/groups`,
                        roleGroups[roleKey] || []
                    );
                } else {
                    await api.put(`/api/permissions/role/${roleKey}`, {
                        permissions: rolePermissions[roleKey] || [],
                    });
                }
            }

            // update baseline
            setInitialRoleGroups({...roleGroups});
            setInitialRolePermissions({...rolePermissions});
            toast.success("Permissions saved");
        } catch (error: any) {
            console.error("Failed to save role permissions:", error);
            const message = error?.message || "Save failed";
            setSaveError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        item: string
    ) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, roleKey: string) => {
        e.preventDefault();
        if (draggedItem) {
            if (viewMode === "groups") {
                const newGroups = {...roleGroups};
                if (!newGroups[roleKey]) newGroups[roleKey] = [];
                if (!newGroups[roleKey].includes(draggedItem)) {
                    newGroups[roleKey] = [...newGroups[roleKey], draggedItem];
                }
                setRoleGroups(newGroups);
            } else {
                const newPermissions = {...rolePermissions};
                if (!newPermissions[roleKey]) newPermissions[roleKey] = [];
                if (!newPermissions[roleKey].includes(draggedItem)) {
                    newPermissions[roleKey] = [...newPermissions[roleKey], draggedItem];
                }
                setRolePermissions(newPermissions);
            }
            setDraggedItem(null);
        }
    };

    const removeItem = (roleKey: string, item: string) => {
        if (viewMode === "groups") {
            const newGroups = {...roleGroups};
            newGroups[roleKey] = newGroups[roleKey].filter((g) => g !== item);
            setRoleGroups(newGroups);
        } else {
            const newPermissions = {...rolePermissions};
            newPermissions[roleKey] = newPermissions[roleKey].filter(
                (p) => p !== item
            );
            setRolePermissions(newPermissions);
        }
    };

    const assignToRole = (roleKey: string, item: string) => {
        if (viewMode === "groups") {
            const newGroups = {...roleGroups};
            if (!newGroups[roleKey].includes(item)) {
                newGroups[roleKey] = [...newGroups[roleKey], item];
                setRoleGroups(newGroups);
            }
        } else {
            const newPermissions = {...rolePermissions};
            if (!newPermissions[roleKey].includes(item)) {
                newPermissions[roleKey] = [...newPermissions[roleKey], item];
                setRolePermissions(newPermissions);
            }
        }
        setContextMenu({show: false, x: 0, y: 0, item: null});
    };

    const handleRightClick = (e: React.MouseEvent, item: string) => {
        e.preventDefault();
        setContextMenu({
            show: true,
            x: (e as React.MouseEvent).clientX,
            y: (e as React.MouseEvent).clientY,
            item,
        });
    };

    const handleAvailableItemClick = (item: string) => {
        if (isMobile) {
            // open bottom sheet for quick assignment
            setMobileAssignItem(item);
        } else {
            // start drag for desktop
            setDraggedItem(item);
        }
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
                    style={{left: contextMenu.x, top: contextMenu.y}}
                >
                    <div className="px-3 py-1 text-xs text-gray-500 border-b">
                        Assign to role:
                    </div>
                    {ROLES.map((role) => (
                        <button
                            key={role.key}
                            onClick={() =>
                                contextMenu.item && assignToRole(role.key, contextMenu.item)
                            }
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/permissions/overview")}
                    >
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>

                    <h1 className="text-2xl font-bold">Role Permission Matrix</h1>

                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === "groups" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("groups")}
                        >
                            <Users className="h-4 w-4 mr-2"/>
                            Groups
                        </Button>
                        <Button
                            variant={viewMode === "permissions" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("permissions")}
                        >
                            <Settings className="h-4 w-4 mr-2"/>
                            Permissions
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {saveError && <div className="text-sm text-red-600">{saveError}</div>}
                    <Button
                        className="flex items-center gap-2"
                        onClick={saveRolePermissions}
                        disabled={saving}
                    >
                        <Save className="h-4 w-4"/>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Available Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">
                            Available{" "}
                            {viewMode === "groups" ? "Permission Groups" : "Permissions"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="hidden md:block">
                                {viewMode === "groups"
                                    ? Array.isArray(allGroups)
                                        ? allGroups.map((group) => (
                                            <div
                                                key={group}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, group)}
                                                onContextMenu={(e) => handleRightClick(e, group)}
                                                className="flex items-center gap-2 p-2 bg-green-50 rounded cursor-move hover:bg-green-100 transition"
                                            >
                                                <Users className="h-4 w-4 text-green-600"/>
                                                <span className="text-sm font-medium">{group}</span>
                                            </div>
                                        ))
                                        : null
                                    : Array.isArray(allPermissions)
                                        ? allPermissions.map((permission) => (
                                            <div
                                                key={permission}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, permission)}
                                                onContextMenu={(e) => handleRightClick(e, permission)}
                                                className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition"
                                            >
                                                <GripVertical className="h-4 w-4 text-gray-400"/>
                                                <span className="text-sm">{permission}</span>
                                            </div>
                                        ))
                                        : null}
                            </div>

                            {/* Mobile: tap to assign */}
                            <div className="md:hidden grid grid-cols-2 gap-2">
                                {viewMode === "groups"
                                    ? (Array.isArray(allGroups) ? allGroups : []).map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => handleAvailableItemClick(g)}
                                            onContextMenu={(e) => handleRightClick(e, g)}
                                            className="flex items-center gap-2 p-2 bg-green-50 rounded hover:bg-green-100 text-left"
                                        >
                                            <Users className="h-4 w-4 text-green-600"/>
                                            <span className="text-sm font-medium truncate">
                          {g}
                        </span>
                                        </button>
                                    ))
                                    : (Array.isArray(allPermissions) ? allPermissions : []).map(
                                        (p) => (
                                            <button
                                                key={p}
                                                onClick={() => handleAvailableItemClick(p)}
                                                onContextMenu={(e) => handleRightClick(e, p)}
                                                className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 text-left"
                                            >
                                                <GripVertical className="h-4 w-4 text-gray-400"/>
                                                <span className="text-sm truncate">{p}</span>
                                            </button>
                                        )
                                    )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Role Columns */}
                <div className="lg:col-span-3">
                    {/* Desktop / Tablet grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {ROLES.map((role) => (
                            <Card
                                key={role.key}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, role.key)}
                                className="min-h-[400px] hover:shadow-md transition-shadow"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-4 w-4"/>
                                        <Badge className={role.color}>{role.name}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {viewMode === "groups"
                                            ? (roleGroups[role.key] || []).map((group) => (
                                                <div
                                                    key={group}
                                                    className="flex items-center justify-between p-2 bg-green-50 rounded"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-green-600"/>
                                                        <span className="text-sm font-medium">
                                {group}
                              </span>
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
                                            : (rolePermissions[role.key] || []).map((permission) => (
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
                                            ))}

                                        {(
                                            (viewMode === "groups"
                                                ? roleGroups[role.key]
                                                : rolePermissions[role.key]) || []
                                        ).length === 0 && (
                                            <div className="text-center text-gray-400 py-8">
                                                Drop {viewMode === "groups" ? "groups" : "permissions"}{" "}
                                                here
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Mobile: horizontal scroller */}
                    <div className="md:hidden flex gap-4 overflow-x-auto py-2">
                        {ROLES.map((role) => (
                            <div key={role.key} className="flex-shrink-0 w-[280px]">
                                <Card
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, role.key)}
                                    className="min-h-[220px]"
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-4 w-4"/>
                                            <Badge className={role.color}>{role.name}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {viewMode === "groups"
                                                ? (roleGroups[role.key] || []).map((group) => (
                                                    <div
                                                        key={group}
                                                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-green-600"/>
                                                            <span className="text-sm font-medium truncate">
                                  {group}
                                </span>
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
                                                : (rolePermissions[role.key] || []).map(
                                                    (permission) => (
                                                        <div
                                                            key={permission}
                                                            className="flex items-center justify-between p-2 bg-blue-50 rounded"
                                                        >
                                <span className="text-sm truncate">
                                  {permission}
                                </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeItem(role.key, permission)
                                                                }
                                                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    )
                                                )}

                                            {(
                                                (viewMode === "groups"
                                                    ? roleGroups[role.key]
                                                    : rolePermissions[role.key]) || []
                                            ).length === 0 && (
                                                <div className="text-center text-gray-400 py-8">
                                                    Tap available items to assign
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile bottom-sheet assign panel */}
            {mobileAssignItem && (
                <div className="fixed left-0 right-0 bottom-0 z-50 bg-background border-t shadow-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                            Assign "{mobileAssignItem}" to
                        </div>
                        <button
                            onClick={() => setMobileAssignItem(null)}
                            className="text-sm text-muted-foreground"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {ROLES.map((role) => (
                            <button
                                key={role.key}
                                onClick={() => {
                                    assignToRole(role.key, mobileAssignItem);
                                    setMobileAssignItem(null);
                                }}
                                className="p-3 bg-card rounded text-left hover:shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {role.name}
                  </span>
                                    <Badge className={role.color}>{role.key}</Badge>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
