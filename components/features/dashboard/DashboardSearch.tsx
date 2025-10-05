import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useFeatures } from "@/lib/useFeatures";
import { FilterDropdown } from "@/components/shared/navigation/FilterDropdown";
import { ROLES } from "@/lib/constants";

interface DashboardSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedView: "patients" | "doctors" | "departments";
  onViewChange: (view: "patients" | "doctors" | "departments") => void;
  activeFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  onAddPatient: () => void;
  filteredCounts: {
    patients: number;
    doctors: number;
    departments: number;
  };
  filterOptions: any[];
}

export function DashboardSearch({
  searchTerm,
  onSearchChange,
  selectedView,
  onViewChange,
  activeFilters,
  onFilterChange,
  onAddPatient,
  filteredCounts,
  filterOptions,
}: DashboardSearchProps) {
  const { user } = useAuth();
  const features = useFeatures();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-lg sm:text-xl">
            {user?.role === ROLES.DOCTOR
              ? "My Patients Dashboard"
              : "Healthcare Management Dashboard"}
          </span>
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.NURSE) && (
            <div className="flex items-center space-x-2 overflow-x-auto">
              <FilterDropdown
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
                onClearFilters={() => onFilterChange({})}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() =>
                  window.open("/customize", "_blank", "noopener,noreferrer")
                }
              >
                <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                Customize
              </Button>
              <Button
                type="button"
                size="sm"
                className="whitespace-nowrap"
                onClick={onAddPatient}
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add New Patient
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {user?.role === ROLES.DOCTOR
            ? "View and manage your assigned patients"
            : "Search and manage all patients, doctors, and departments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                user?.role === ROLES.DOCTOR
                  ? "Search your patients by case number, name, email, phone..."
                  : "Search by case number, name, email, phone..."
              }
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              <Button
                type="button"
                variant={selectedView === "patients" ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => onViewChange("patients")}
              >
                <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                {user?.role === ROLES.DOCTOR ? "My Patients" : "Patients"} (
                {filteredCounts.patients})
              </Button>

              {user?.role !== "doctor" && features.roles.nurse && (
                <Button
                  type="button"
                  variant={selectedView === "doctors" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => onViewChange("doctors")}
                >
                  <Stethoscope className="h-4 w-4 mr-2" aria-hidden="true" />
                  Doctors ({filteredCounts.doctors})
                </Button>
              )}

              {features.wardManagement && (
                <Button
                  type="button"
                  variant={
                    selectedView === "departments" ? "default" : "outline"
                  }
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => onViewChange("departments")}
                >
                  <Building2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Departments ({filteredCounts.departments})
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
