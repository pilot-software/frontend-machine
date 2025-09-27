"use client";

import React, { useState, useEffect } from "react";
import { PatientFormModal } from "../../../components/PatientFormModal";
import { useAppData } from "../../../lib/hooks/useAppData";
import { userService, ApiUser } from "../../../lib/services/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import { Mail, Phone, User as UserIcon, Eye } from "lucide-react";

type RoleKey = "admin" | "doctor" | "reception" | "patient";
type ApiRoleKey = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";

interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role: RoleKey;
}

const roleMapping: Record<RoleKey, ApiRoleKey> = {
  admin: "ADMIN",
  doctor: "DOCTOR",
  reception: "RECEPTIONIST",
  patient: "PATIENT"
};

function makeId(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function GenericUserModal({ open, onClose, mode, user, role, onSave }: any) {
  const [form, setForm] = useState<any>(
    () =>
      user || {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
      }
  );

  React.useEffect(() => {
    setForm(
      user || {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
      }
    );
  }, [user, open]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (field: string, value: string) =>
    setForm((p: any) => ({ ...p, [field]: value }));

  const submit = () => {
    onSave && onSave({ ...form, role });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[850px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">
                  {form.firstName} {form.lastName}
                </h3>
                <Badge variant="secondary" className="capitalize">
                  {role}
                </Badge>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                {user?.email}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Primary contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>{form.email || "—"}</div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>{form.phone || "—"}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">
                      Department
                    </div>
                    <div>{form.department || "—"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Profile and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>First name</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      disabled={isView}
                    />
                  </div>
                  <div>
                    <Label>Last name</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      disabled={isView}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={isView}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={isView}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  {!isView && (
                    <Button onClick={submit} className="bg-blue-600 text-white">
                      {isEdit ? "Save changes" : "Create"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [searchTerms, setSearchTerms] = useState<Record<RoleKey, string>>({
    admin: "",
    doctor: "",
    reception: "",
    patient: "",
  });

  const [apiUsers, setApiUsers] = useState<Record<RoleKey, ApiUser[]>>({
    admin: [],
    doctor: [],
    reception: [],
    patient: []
  });

  const [loading, setLoading] = useState<Record<RoleKey, boolean>>({
    admin: false,
    doctor: false,
    reception: false,
    patient: false
  });

  const [admins, setAdmins] = useState<DemoUser[]>([]);
  const [doctors, setDoctors] = useState<DemoUser[]>([]);
  const [receptions, setReceptions] = useState<DemoUser[]>([]);

  const { patients: appPatients } = useAppData();

  const [activeModal, setActiveModal] = useState<{
    open: boolean;
    role?: RoleKey;
    mode?: "view" | "edit" | "add";
    user?: DemoUser | null;
  }>({ open: false, role: "admin", mode: "view", user: null });

  const fetchUsersByRole = async (role: RoleKey) => {
    setLoading(prev => ({ ...prev, [role]: true }));
    try {
      const apiRole = roleMapping[role];
      const users = await userService.getUsersByRole(apiRole);
      setApiUsers(prev => ({ ...prev, [role]: users }));
    } catch (error) {
      console.error(`Failed to fetch ${role}s:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [role]: false }));
    }
  };

  useEffect(() => {
    // Load all roles on component mount
    Object.keys(roleMapping).forEach(role => {
      fetchUsersByRole(role as RoleKey);
    });
  }, []);

  const roleMap: RoleKey[] = ["admin", "doctor", "reception", "patient"];

  const handleSearchChange = (role: RoleKey, value: string) =>
    setSearchTerms((prev) => ({ ...prev, [role]: value }));

  const filteredList = (role: RoleKey) => {
    const term = (searchTerms[role] || "").toLowerCase();
    
    // Use API data if available, fallback to local data
    const apiData = apiUsers[role] || [];
    const apiList: DemoUser[] = apiData.map((user: ApiUser) => {
      const nameParts = user.name.split(' ');
      return {
        id: user.id,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        phone: user.phone || '',
        department: user.department || user.specialization || '',
        role: role
      };
    });

    // Fallback to local demo data if no API data
    const localList: DemoUser[] = 
      role === "admin" ? admins :
      role === "doctor" ? doctors :
      role === "reception" ? receptions :
      (appPatients || []).map((p: any) => ({
        id: p.id,
        firstName: p.firstName || p.name || "",
        lastName: p.lastName || "",
        email: p.email || "",
        phone: p.phone || "",
        role: "patient",
      }));

    const list = apiList.length > 0 ? apiList : localList;

    if (!term) return list;

    return list.filter(
      (u: DemoUser) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone || "").includes(term)
    );
  };

  const handleDelete = (role: RoleKey, id: string) => {
    if (!confirm("Delete this user?")) return;
    if (role === "admin") setAdmins((prev) => prev.filter((p) => p.id !== id));
    if (role === "doctor")
      setDoctors((prev) => prev.filter((p) => p.id !== id));
    if (role === "reception")
      setReceptions((prev) => prev.filter((p) => p.id !== id));
    if (role === "patient")
      // Local demo deletion isn't supported for app-backed patients; show a warning
      alert(
        "Deleting patients from this view is not supported. Please use the Patients registry."
      );
  };

  const handleSave = (role: RoleKey, data: any) => {
    if (data.id) {
      // edit
      if (role === "admin")
        setAdmins((prev) =>
          prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
        );
      if (role === "doctor")
        setDoctors((prev) =>
          prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
        );
      if (role === "reception")
        setReceptions((prev) =>
          prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
        );
      if (role === "patient")
        // Editing patients from this demo modal is not synced to the app store.
        alert(
          "Editing patients from this demo modal is not supported. Use the Patients registry."
        );
    } else {
      // create
      const newUser: DemoUser = {
        id: makeId(role + "_"),
        firstName: data.firstName || "First",
        lastName: data.lastName || "Last",
        email: data.email || `${makeId("user")}@example.com`,
        phone: data.phone,
        department: data.department,
        role,
      };
      if (role === "admin") setAdmins((prev) => [newUser, ...prev]);
      if (role === "doctor") setDoctors((prev) => [newUser, ...prev]);
      if (role === "reception") setReceptions((prev) => [newUser, ...prev]);
      if (role === "patient") {
        // For patients we rely on the central app state; creating via GenericUserModal is demo-only
        alert(
          "Patient creation from this small form will not be persisted to the app. Use the Add Patient flow instead."
        );
      }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage admins, doctors, receptions and patients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleMap.map((role) => {
          const term = searchTerms[role] || "";
          return (
            <div key={role} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium capitalize flex items-center gap-2">
                  {role}s
                  {loading[role] && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <div>
                  <input
                    className="border px-2 py-1 mr-2"
                    value={term}
                    onChange={(e) => handleSearchChange(role, e.target.value)}
                    placeholder={`Search ${role}...`}
                  />
                  <button
                    className="px-2 py-1 bg-blue-600 text-white mr-1"
                    onClick={() => fetchUsersByRole(role)}
                    disabled={loading[role]}
                  >
                    Refresh
                  </button>
                  <button
                    className="px-2 py-1 bg-green-600 text-white"
                    onClick={() => {
                      if (role === "patient") {
                        setActiveModal({
                          open: true,
                          role,
                          mode: "add",
                          user: null,
                        });
                        return;
                      }
                      setActiveModal({
                        open: true,
                        role,
                        mode: "add",
                        user: null,
                      });
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {filteredList(role).map((user: DemoUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm">
                        {user.email} • {user.phone}
                      </div>
                    </div>
                    <div className="space-x-1">
                      <button
                        className="px-2 py-1"
                        onClick={() =>
                          setActiveModal({
                            open: true,
                            role,
                            mode: "view",
                            user,
                          })
                        }
                      >
                        View
                      </button>
                      <button
                        className="px-2 py-1"
                        onClick={() =>
                          setActiveModal({
                            open: true,
                            role,
                            mode: "edit",
                            user,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 text-red-600"
                        onClick={() => handleDelete(role, user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {filteredList(role).length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No records
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeModal.open && activeModal.role === "patient" ? (
        <PatientFormModal
          isOpen={true}
          onClose={() =>
            setActiveModal({
              open: false,
              role: "admin",
              mode: "view",
              user: null,
            })
          }
          mode={(activeModal.mode as "add" | "edit" | "view") || "add"}
          patientId={activeModal.user?.id}
        />
      ) : activeModal.open ? (
        <GenericUserModal
          open={activeModal.open}
          onClose={() =>
            setActiveModal({
              open: false,
              role: "admin",
              mode: "view",
              user: null,
            })
          }
          mode={activeModal.mode}
          role={activeModal.role}
          user={activeModal.user}
          onSave={(data: any) => handleSave(activeModal.role as RoleKey, data)}
        />
      ) : null}
    </div>
  );
}
