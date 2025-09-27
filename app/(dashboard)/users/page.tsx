"use client";

import React, { useState } from "react";
import { PatientFormModal } from "../../../components/PatientFormModal";
import { useAppData } from "../../../lib/hooks/useAppData";

type RoleKey = "admin" | "doctor" | "reception" | "patient";

interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role: RoleKey;
}

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

  React.useEffect(
    () =>
      setForm(
        user || {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
        }
      ),
    [user, open]
  );

  const handleChange = (field: string, value: string) =>
    setForm((p: any) => ({ ...p, [field]: value }));

  const submit = () => {
    onSave && onSave({ ...form, role });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded p-4 w-96">
        <h3 className="text-lg font-semibold mb-2">
          {mode === "add"
            ? `Add ${role}`
            : mode === "edit"
            ? `Edit ${role}`
            : `View ${role}`}
        </h3>
        <div className="space-y-2">
          <input
            className="w-full border px-2 py-1"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="First name"
            disabled={mode === "view"}
          />
          <input
            className="w-full border px-2 py-1"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Last name"
            disabled={mode === "view"}
          />
          <input
            className="w-full border px-2 py-1"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            disabled={mode === "view"}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-3">
          <button className="px-3 py-1 border" onClick={onClose}>
            Close
          </button>
          {mode !== "view" && (
            <button
              className="px-3 py-1 bg-blue-600 text-white"
              onClick={submit}
            >
              {mode === "add" ? "Create" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [searchTerms, setSearchTerms] = useState<Record<RoleKey, string>>({
    admin: "",
    doctor: "",
    reception: "",
    patient: "",
  });

  const [admins, setAdmins] = useState<DemoUser[]>([
    {
      id: "a1",
      firstName: "Alice",
      lastName: "Admin",
      email: "alice@hospital.com",
      phone: "555-0101",
      role: "admin",
    },
    {
      id: "a2",
      firstName: "Aaron",
      lastName: "Admin",
      email: "aaron@hospital.com",
      phone: "555-0102",
      role: "admin",
    },
  ]);

  const [doctors, setDoctors] = useState<DemoUser[]>([
    {
      id: "d1",
      firstName: "Dr. Sarah",
      lastName: "Johnson",
      email: "sarah.j@hospital.com",
      phone: "555-0110",
      department: "Cardiology",
      role: "doctor",
    },
    {
      id: "d2",
      firstName: "Dr. Michael",
      lastName: "Chen",
      email: "michael.c@hospital.com",
      phone: "555-0111",
      department: "Emergency",
      role: "doctor",
    },
  ]);

  const [receptions, setReceptions] = useState<DemoUser[]>([
    {
      id: "r1",
      firstName: "Rita",
      lastName: "Reception",
      email: "rita@hospital.com",
      phone: "555-0120",
      role: "reception",
    },
  ]);

  const { patients: appPatients } = useAppData();

  const [activeModal, setActiveModal] = useState<{
    open: boolean;
    role?: RoleKey;
    mode?: "view" | "edit" | "add";
    user?: DemoUser | null;
  }>({ open: false, role: "admin", mode: "view", user: null });

  const roleMap: RoleKey[] = ["admin", "doctor", "reception", "patient"];

  const handleSearchChange = (role: RoleKey, value: string) =>
    setSearchTerms((prev) => ({ ...prev, [role]: value }));

  const filteredList = (role: RoleKey) => {
    const term = (searchTerms[role] || "").toLowerCase();
    // map appPatients into the demo user shape for listing
    const patientList: DemoUser[] = (appPatients || []).map((p: any) => ({
      id: p.id,
      firstName: p.firstName || p.name || "",
      lastName: p.lastName || "",
      email: p.email || "",
      phone: p.phone || "",
      role: "patient",
    }));

    const list: DemoUser[] =
      role === "admin"
        ? admins
        : role === "doctor"
        ? doctors
        : role === "reception"
        ? receptions
        : patientList;

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
                <div className="font-medium capitalize">{role}s</div>
                <div>
                  <input
                    className="border px-2 py-1 mr-2"
                    value={term}
                    onChange={(e) => handleSearchChange(role, e.target.value)}
                    placeholder={`Search ${role}...`}
                  />
                  <button
                    className="px-2 py-1 bg-green-600 text-white"
                    onClick={() => {
                      if (role === "patient") {
                        // Open the create patient modal (reuse PatientFormModal)
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
