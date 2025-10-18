"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Clock,
  Edit,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Pill,
  Printer,
  Search,
  Stethoscope,
  UserPlus,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthContext";
import { ROLES } from "@/lib/constants";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  caseNumber: string;
  assignedDoctor: string;
  department: string;
  lastVisit: string;
  avatar?: string;
}

interface PatientDataTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient, origin: { x: number; y: number }) => void;
  onEditPatient: (patientId: string) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "active":
      return {
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Active"
      };
    case "critical":
      return {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        dot: "bg-red-500 animate-pulse",
        label: "Critical"
      };
    case "inactive":
      return {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        dot: "bg-gray-400",
        label: "Inactive"
      };
    default:
      return {
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
        label: status
      };
  }
};

export function PatientDataTable({
  patients,
  onViewPatient,
  onEditPatient,
}: PatientDataTableProps) {
  const { user } = useAuth();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    patient: true,
    caseNumber: true,
    status: true,
    department: true,
    lastVisit: true,
    quickActions: true,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const columns = React.useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "firstName",
        id: "patient",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Patient Information
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const patient = row.original;
          const statusConfig = getStatusConfig(patient.status);
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="relative">
                <Avatar className="h-11 w-11 border-2 border-border">
                  <AvatarImage src={patient.avatar} alt={patient.firstName} />
                  <AvatarFallback className="text-sm font-medium">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${statusConfig.dot}`} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span>{patient.phone}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "caseNumber",
        header: "Case ID",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono font-semibold">
              {row.getValue("caseNumber")}
            </code>
            <span className="text-xs text-muted-foreground">
              DOB: {row.original.dateOfBirth}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Status
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const config = getStatusConfig(status);
          return (
            <Badge className={`${config.color} border font-medium`}>
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot} mr-1.5`} />
              {config.label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
              {row.getValue("department")}
            </div>
            <div className="text-xs text-muted-foreground">
              Dr. {row.original.assignedDoctor}
            </div>
          </div>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "lastVisit",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Last Visit
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const lastVisit = row.getValue("lastVisit") as string;
          const daysAgo = Math.floor((new Date().getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {lastVisit}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
              </div>
            </div>
          );
        },
      },
      {
        id: "quickActions",
        header: "Quick Actions",
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={() => {
                  const locale = window.location.pathname.split("/")[1] || "en";
                  window.open(`/${locale}/patient/${patient.id}`, "_blank");
                }}
                title="View Medical Records"
              >
                <FileText className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                title="Schedule Appointment"
              >
                <Calendar className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                title="Prescriptions"
              >
                <Pill className="h-4 w-4 text-purple-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(user?.role === ROLES.ADMIN || user?.role === ROLES.DOCTOR) && (
                    <>
                      <DropdownMenuItem onClick={() => {
                        const locale = window.location.pathname.split("/")[1] || "en";
                        window.location.href = `/${locale}/patients/edit/${patient.id}`;
                      }}>
                        <Edit className="h-4 w-4 mr-2 text-blue-600" />
                        Edit Patient Info
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2 text-green-600" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2 text-purple-600" />
                        Call Patient
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2 text-gray-600" />
                        Print Summary
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <X className="h-4 w-4 mr-2 text-red-600" />
                        Discharge Patient
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onViewPatient, onEditPatient, user?.role]
  );

  const filteredPatients = React.useMemo(() => {
    if (statusFilter === "all") return patients;
    return patients.filter(p => p.status.toLowerCase() === statusFilter);
  }, [patients, statusFilter]);

  const table = useReactTable({
    data: filteredPatients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const patient = row.original;
      return (
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search) ||
        patient.email.toLowerCase().includes(search) ||
        patient.phone.toLowerCase().includes(search) ||
        patient.caseNumber.toLowerCase().includes(search) ||
        patient.department.toLowerCase().includes(search)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 25 },
    },
  });

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: patients.length, active: 0, critical: 0, inactive: 0 };
    patients.forEach(p => {
      const status = p.status.toLowerCase();
      if (status in counts) counts[status]++;
    });
    return counts;
  }, [patients]);

  return (
    <div className="w-full space-y-4">
      {/* Modern Search & Filter Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or case ID..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-10 bg-background"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setGlobalFilter("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          {[
            { value: "all", label: "All Patients", count: statusCounts.all },
            { value: "active", label: "Active", count: statusCounts.active },
            { value: "critical", label: "Critical", count: statusCounts.critical },
            { value: "inactive", label: "Inactive", count: statusCounts.inactive },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className="h-8"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* Modern Table */}
      <Card>
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors border-b last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UserPlus className="h-8 w-8" />
                    <p className="text-sm font-medium">No patients found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </CardContent>
      </Card>

      {/* Modern Pagination */}
      <Card>
        <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
          <span className="font-medium text-foreground">
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}
          </span>{" "}
          of <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> patients
          </div>
          <div className="flex items-center gap-2">
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>{size} rows</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            First
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm font-medium">
            <span>{table.getState().pagination.pageIndex + 1}</span>
            <span className="text-muted-foreground">/</span>
            <span>{table.getPageCount()}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            Last
          </Button>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
