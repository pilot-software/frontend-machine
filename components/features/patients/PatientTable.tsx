import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  ExternalLink,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Printer,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { printService } from "@/lib/utils/printService";
import { useIsMobile } from "@/components/ui/use-mobile";
import { ROLES } from "@/lib/constants";

interface PatientTableProps {
  patients: any[];
  onViewPatient: (patient: any, origin: { x: number; y: number }) => void;
  onEditPatient: (patientId: string) => void;
  isColumnVisible: (table: string, column: string) => boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "critical":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export function PatientTable({
  patients,
  onViewPatient,
  onEditPatient,
  isColumnVisible,
}: PatientTableProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedPatients = useMemo(() => {
    if (!sortField) return patients;
    
    return [...patients].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === "patient") {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [patients, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ field, children, className }: { field: string; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        className="h-auto p-0 font-semibold hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        {children}
        {sortField === field && (
          sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </Button>
    </TableHead>
  );

  const handleOpenInNewTab = (patientId: string) => {
    window.open(`/patient/${patientId}`, "_blank", "noopener,noreferrer");
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {sortedPatients.map((patient, index) => (
          <Card
            key={patient.id || `patient-${index}`}
            className="overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar} alt={patient.firstName} />
                    <AvatarFallback>
                      {(patient.firstName || "U")[0]}
                      {(patient.lastName || "N")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      DOB: {patient.dateOfBirth}
                    </p>
                    <Badge
                      className={`${getStatusColor(
                        patient.status
                      )} text-xs mt-1`}
                    >
                      {patient.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 touch-target"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onViewPatient(patient, {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                      });
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {(user?.role === ROLES.ADMIN ||
                    user?.role === ROLES.DOCTOR) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 touch-target"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenInNewTab(patient.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditPatient(patient.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => printService.printPatient(patient)}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print Info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Case #:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {patient.caseNumber}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="truncate ml-2">
                    {patient.assignedDoctor}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="truncate ml-2">{patient.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span className="truncate ml-2">{patient.lastVisit}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center text-xs mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{patient.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto px-6 pt-0 pb-6">
      <Table>
        <TableHeader>
          <TableRow>
            {isColumnVisible("patients", "patient") && (
              <SortableHeader field="patient" className="min-w-[200px]">Patient</SortableHeader>
            )}
            {isColumnVisible("patients", "caseNumber") && (
              <SortableHeader field="caseNumber" className="min-w-[100px]">Case #</SortableHeader>
            )}
            {isColumnVisible("patients", "contact") && (
              <TableHead className="min-w-[200px]">Contact</TableHead>
            )}
            {isColumnVisible("patients", "doctor") && (
              <SortableHeader field="assignedDoctor" className="min-w-[150px]">Doctor</SortableHeader>
            )}
            {isColumnVisible("patients", "department") && (
              <SortableHeader field="department" className="min-w-[120px]">Department</SortableHeader>
            )}
            {isColumnVisible("patients", "status") && (
              <SortableHeader field="status" className="min-w-[100px]">Status</SortableHeader>
            )}
            {isColumnVisible("patients", "lastVisit") && (
              <SortableHeader field="lastVisit" className="min-w-[120px]">Last Visit</SortableHeader>
            )}
            {isColumnVisible("patients", "actions") && (
              <TableHead className="min-w-[150px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPatients.map((patient, index) => (
            <TableRow key={patient.id || `patient-${index}`}>
              {isColumnVisible("patients", "patient") && (
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={patient.avatar}
                        alt={patient.firstName}
                      />
                      <AvatarFallback>
                        {(patient.firstName || "U")[0]}
                        {(patient.lastName || "N")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        DOB: {patient.dateOfBirth}
                      </p>
                    </div>
                  </div>
                </TableCell>
              )}
              {isColumnVisible("patients", "caseNumber") && (
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {patient.caseNumber}
                  </code>
                </TableCell>
              )}
              {isColumnVisible("patients", "contact") && (
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1" />
                      {patient.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      {patient.phone}
                    </div>
                  </div>
                </TableCell>
              )}
              {isColumnVisible("patients", "doctor") && (
                <TableCell>{patient.assignedDoctor}</TableCell>
              )}
              {isColumnVisible("patients", "department") && (
                <TableCell>{patient.department}</TableCell>
              )}
              {isColumnVisible("patients", "status") && (
                <TableCell>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                </TableCell>
              )}
              {isColumnVisible("patients", "lastVisit") && (
                <TableCell>{patient.lastVisit}</TableCell>
              )}
              {isColumnVisible("patients", "actions") && (
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-110 hover:bg-accent group touch-target"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        onViewPatient(patient, {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        });
                      }}
                      aria-label="View patient details"
                    >
                      <Eye
                        className="h-4 w-4 transition-all duration-200 group-hover:text-blue-600 group-hover:scale-125"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-110 hover:bg-accent group touch-target"
                      onClick={() => handleOpenInNewTab(patient.id)}
                      aria-label="Open patient in new tab"
                    >
                      <ExternalLink
                        className="h-4 w-4 transition-all duration-200 group-hover:text-green-600 group-hover:scale-125"
                        aria-hidden="true"
                      />
                    </Button>
                    {(user?.role === ROLES.ADMIN ||
                      user?.role === ROLES.DOCTOR) && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="transition-all duration-200 hover:scale-110 hover:bg-accent group touch-target"
                          onClick={() => onEditPatient(patient.id)}
                          aria-label="Edit patient"
                        >
                          <Edit
                            className="h-4 w-4 transition-all duration-200 group-hover:text-orange-600 group-hover:scale-125"
                            aria-hidden="true"
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="touch-target"
                              aria-label="More actions"
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => printService.printPatient(patient)}
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print Info
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
