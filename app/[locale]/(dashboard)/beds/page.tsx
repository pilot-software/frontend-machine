"use client";

import { useState, useEffect } from "react";
import { bedService, ApiBed } from "@/lib/services/bed";
import { AuthGuard } from "@/components/shared/guards/AuthGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bed,
  Search,
  Filter,
  Plus,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  Calendar as CalendarIcon,
} from "lucide-react";

interface BedInfo {
  id: string;
  bedNumber: string;
  ward: string;
  floor: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  patientId: string | null;
  patientName: string | null;
  condition: string | null;
  lastCleaned: string;
}

export default function BedManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [beds, setBeds] = useState<BedInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBed, setNewBed] = useState({
    bedNumber: "",
    ward: "",
    floor: "",
    status: "AVAILABLE" as const,
    branchId: "branch_main"
  });

  useEffect(() => {
    loadBeds();
  }, []);

  const loadBeds = async () => {
    try {
      setLoading(true);
      const data = await bedService.getAll();
      setBeds(data);
    } catch (error) {
      console.error('Failed to load beds:', error);
    } finally {
      setLoading(false);
    }
  };

  const wards = ["all", "General", "ICU", "Pediatric"];

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = selectedWard === "all" || bed.ward === selectedWard;
    return matchesSearch && matchesWard;
  });

  const totalPages = Math.ceil(filteredBeds.length / pageSize);
  const paginatedBeds = filteredBeds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === "AVAILABLE").length,
    occupied: beds.filter((b) => b.status === "OCCUPIED").length,
    maintenance: beds.filter((b) => b.status === "MAINTENANCE").length,
    reserved: beds.filter((b) => b.status === "RESERVED").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case "OCCUPIED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200";
      case "RESERVED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AuthGuard
      requiredPermissions={[
        "BEDS_VIEW",
        "BEDS_MANAGE",
        "SYSTEM_HOSPITAL_SETTINGS",
        "USERS_MANAGE_PERMISSIONS",
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Bed Management"
          description="Monitor and manage hospital bed availability"
          action={
            <Button onClick={() => setIsAddBedOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bed
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
          <StatsCard
            title="Total Beds"
            value={stats.total}
            icon={Bed}
            color="text-blue-600"
            bgGradient="from-blue-500 to-blue-600"
            change="All beds"
            trend="neutral"
          />
          <StatsCard
            title="Available"
            value={stats.available}
            icon={CheckCircle}
            color="text-green-600"
            bgGradient="from-green-500 to-green-600"
            change={`${Math.round((stats.available / stats.total) * 100)}%`}
            trend="up"
          />
          <StatsCard
            title="Occupied"
            value={stats.occupied}
            icon={User}
            color="text-purple-600"
            bgGradient="from-purple-500 to-purple-600"
            change={`${Math.round((stats.occupied / stats.total) * 100)}%`}
            trend="neutral"
          />
          <StatsCard
            title="Maintenance"
            value={stats.maintenance}
            icon={Wrench}
            color="text-orange-600"
            bgGradient="from-orange-500 to-orange-600"
            change="Under repair"
            trend="neutral"
          />
          <StatsCard
            title="Reserved"
            value={stats.reserved}
            icon={CalendarIcon}
            color="text-red-600"
            bgGradient="from-red-500 to-red-600"
            change="Pre-booked"
            trend="neutral"
          />
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search by bed number or patient name..."
          filters={
            <div className="flex gap-2">
              {wards.map((ward) => (
                <Button
                  key={ward}
                  variant={selectedWard === ward ? "default" : "outline"}
                  onClick={() => setSelectedWard(ward)}
                  className="capitalize"
                >
                  {ward}
                </Button>
              ))}
            </div>
          }
        />

        {/* Mobile: 2-column grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {paginatedBeds.map((bed) => (
              <Card key={bed.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-2">
                  <div className="flex flex-col items-center text-center">
                    <Bed className="h-8 w-8 mb-2 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">{bed.bedNumber}</h3>
                    <p className="text-xs text-muted-foreground">{bed.ward}</p>
                    <Badge className={`${getStatusColor(bed.status)} text-xs mt-1`}>
                      {bed.status}
                    </Badge>
                    {bed.patientId && (
                      <p className="text-xs font-medium mt-2 truncate w-full">{bed.patientId}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop: Table view */}
        <Card className="hidden lg:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bed Number</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Last Cleaned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBeds.map((bed) => (
                    <TableRow key={bed.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                      <TableCell>{bed.ward}</TableCell>
                      <TableCell>{bed.floor}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bed.status)}>
                          {bed.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {bed.patientName || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {bed.condition || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{bed.lastCleaned || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredBeds.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, filteredBeds.length)}</span> of{" "}
                  <span className="font-medium text-foreground">{filteredBeds.length}</span> beds
                </div>
                <div className="flex items-center gap-2">
                  <Select value={`${pageSize}`} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1); }}>
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem key={size} value={`${size}`}>{size} rows</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm font-medium">
                    <span>{currentPage}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{totalPages}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Bed Dialog */}
      <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bedNumber">Bed Number</Label>
              <Input
                id="bedNumber"
                placeholder="e.g., 101-A"
                value={newBed.bedNumber}
                onChange={(e) =>
                  setNewBed({ ...newBed, bedNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Ward</Label>
              <Select
                value={newBed.ward}
                onValueChange={(value) => setNewBed({ ...newBed, ward: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Maternity">Maternity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                placeholder="e.g., 1"
                value={newBed.floor}
                onChange={(e) =>
                  setNewBed({ ...newBed, floor: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newBed.status}
                onValueChange={(value: any) =>
                  setNewBed({ ...newBed, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                try {
                  await bedService.create(newBed);
                  await loadBeds();
                  setIsAddBedOpen(false);
                  setNewBed({
                    bedNumber: "",
                    ward: "",
                    floor: "",
                    status: "AVAILABLE",
                    branchId: "branch_main"
                  });
                } catch (error) {
                  console.error('Failed to create bed:', error);
                  alert('Failed to create bed');
                }
              }}
            >
              Add Bed
            </Button>
            <Button variant="outline" onClick={() => setIsAddBedOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
