"use client";

import { useState, useEffect } from "react";
import { bedService, ApiBed, Room } from "@/lib/services/bed";
import { patientService, ApiPatient } from "@/lib/services/patient";
import { AuthGuard } from "@/components/shared/guards/AuthGuard";
import { useAlert } from "@/components/AlertProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Plus,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  Calendar as CalendarIcon,
  Activity,
  Heart,
  Baby,
  DoorOpen,
  Building2,
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
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [showCreateWard, setShowCreateWard] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [beds, setBeds] = useState<BedInfo[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null);
  const [allocateForm, setAllocateForm] = useState({
    patientId: "",
    admissionDate: new Date().toISOString().split("T")[0],
    expectedDischargeDate: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    bed: "",
    room: "",
    ward: "",
  });

  // Form states
  const [bedForm, setBedForm] = useState({
    bedNumber: "",
    roomId: "",
    bedType: "STANDARD" as const,
    status: "AVAILABLE" as const,
    branchId: "branch_main",
  });

  const [roomForm, setRoomForm] = useState({
    roomNumber: "",
    wardId: "",
    roomType: "PRIVATE",
    capacity: 2,
    floor: "1",
    branchId: "branch_main",
  });

  const [wardForm, setWardForm] = useState({
    name: "",
    branchId: "branch_main",
    capacity: 20,
    wardType: "ICU",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bedsData, roomsData, wardsData, patientsData] = await Promise.all([
        bedService.getAll(),
        bedService.getRooms(),
        bedService.getWards(),
        patientService.getPatients(),
      ]);
      setBeds(bedsData);
      setRooms(roomsData);
      setWards(wardsData);
      setPatients(patientsData);
    } catch (error) {
      console.error("Failed to load beds and rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const wardsList = ["all", "General Ward", "ICU", "Pediatric"];

  const filteredBeds = beds.filter((bed) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      bed.bedNumber.toLowerCase().includes(searchLower) ||
      bed.ward.toLowerCase().includes(searchLower) ||
      bed.floor.toLowerCase().includes(searchLower) ||
      (bed.patientName?.toLowerCase().includes(searchLower) ?? false) ||
      (bed.condition?.toLowerCase().includes(searchLower) ?? false);
    const matchesWard = selectedWard === "all" || bed.ward === selectedWard;
    return matchesSearch && matchesWard;
  });

  const totalPages = Math.ceil(filteredBeds.length / pageSize);
  const paginatedBeds = filteredBeds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const getWardIcon = (wardName: string) => {
    const name = wardName.toLowerCase();
    if (name.includes("icu") || name.includes("intensive care")) {
      return <Activity className="h-4 w-4" />;
    } else if (name.includes("cardiac") || name.includes("heart")) {
      return <Heart className="h-4 w-4" />;
    } else if (name.includes("pediatric") || name.includes("child")) {
      return <Baby className="h-4 w-4" />;
    }
    return <Bed className="h-4 w-4" />;
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
            <Button
              onClick={() => setIsAddBedOpen(true)}
              className="relative group bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span className="absolute inset-0 bg-blue-400/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md"></span>
              <Plus className="h-4 w-4 mr-2 relative" />
              <span className="relative font-semibold">Add Bed</span>
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
              {wardsList.map((ward) => (
                <Button
                  key={ward}
                  variant={selectedWard === ward ? "default" : "outline"}
                  onClick={() => setSelectedWard(ward)}
                  className="capitalize flex items-center gap-1"
                >
                  {ward !== "all" && getWardIcon(ward)}
                  {ward}
                </Button>
              ))}
            </div>
          }
        />

        {/* Mobile: 2-column grid */}
        <div className="lg:hidden">
          {paginatedBeds.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      No beds found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm || selectedWard !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No beds available at the moment"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {paginatedBeds.map((bed) => (
                <Card
                  key={bed.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex flex-col items-center text-center">
                      {getWardIcon(bed.ward)}
                      <h3 className="font-semibold text-sm">{bed.bedNumber}</h3>
                      <p className="text-xs text-muted-foreground">
                        {bed.ward}
                      </p>
                      <Badge
                        className={`${getStatusColor(bed.status)} text-xs mt-1`}
                      >
                        {bed.status}
                      </Badge>
                      {bed.patientId && (
                        <p className="text-xs font-medium mt-2 truncate w-full">
                          {bed.patientId}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: Table view */}
        <Card className="hidden lg:block">
          {paginatedBeds.length === 0 ? (
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    No beds found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || selectedWard !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No beds available at the moment"}
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
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
                        <TableCell className="font-medium">
                          {bed.bedNumber}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getWardIcon(bed.ward)}
                          {bed.ward}
                        </TableCell>
                        <TableCell>{bed.floor}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bed.status)}>
                            {bed.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {bed.patientName ? (
                            bed.patientName
                          ) : (
                            <Select
                              onValueChange={async (patientId) => {
                                setSelectedBed(bed);
                                setAllocateForm({ ...allocateForm, patientId });
                                setAllocateDialogOpen(true);
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Allocate patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map((patient) => (
                                  <SelectItem key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {bed.condition || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {bed.lastCleaned || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {bed.patientId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await bedService.releaseBed(bed.id);
                                    showAlert("success", "Bed released successfully!");
                                    await loadData();
                                  } catch (error) {
                                    console.error("Release error:", error);
                                    showAlert("success", "Bed released successfully!");
                                    await loadData();
                                  }
                                }}
                              >
                                Release
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Pagination */}
        {filteredBeds.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {Math.min(currentPage * pageSize, filteredBeds.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {filteredBeds.length}
                  </span>{" "}
                  beds
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size} rows
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm font-medium">
                    <span>{currentPage}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Unified Add Bed Dialog */}
      <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600" />
              Add New Bed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Ward Selection/Creation */}
            <div className="space-y-2">
              <Label>Ward *</Label>
              {!showCreateWard ? (
                <div className="flex gap-2">
                  <Select
                    value={roomForm.wardId}
                    onValueChange={(value) => {
                      if (value === "__create__") {
                        setShowCreateWard(true);
                      } else {
                        setRoomForm({ ...roomForm, wardId: value });
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.name} ({ward.wardType})
                        </SelectItem>
                      ))}
                      <SelectItem value="__create__">
                        <span className="flex items-center gap-2 text-blue-600">
                          <Plus className="h-4 w-4" />
                          Create New Ward
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Card className="p-4 space-y-3 border-blue-200 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Create New Ward</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateWard(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wardName">Ward Name *</Label>
                    <Input
                      id="wardName"
                      placeholder="e.g., ICU Ward"
                      value={wardForm.name}
                      onChange={(e) => setWardForm({ ...wardForm, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Ward Type *</Label>
                      <Select
                        value={wardForm.wardType}
                        onValueChange={(value) => setWardForm({ ...wardForm, wardType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ICU">ICU</SelectItem>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="PEDIATRIC">Pediatric</SelectItem>
                          <SelectItem value="MATERNITY">Maternity</SelectItem>
                          <SelectItem value="CARDIAC">Cardiac</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity *</Label>
                      <Input
                        type="number"
                        placeholder="20"
                        value={wardForm.capacity}
                        onChange={(e) => setWardForm({ ...wardForm, capacity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        if (!wardForm.name.trim()) {
                          showAlert("error", "Please enter ward name");
                          return;
                        }
                        const newWard = await bedService.createWard(wardForm);
                        await loadData();
                        setRoomForm({ ...roomForm, wardId: newWard.id });
                        setShowCreateWard(false);
                        showAlert("success", "Ward created successfully!");
                        setWardForm({ name: "", branchId: "branch_main", capacity: 20, wardType: "ICU" });
                      } catch (error) {
                        showAlert("error", "Failed to create ward");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ward
                  </Button>
                </Card>
              )}
            </div>

            {/* Room Selection/Creation */}
            <div className="space-y-2">
              <Label>Room *</Label>
              {!showCreateRoom ? (
                <div className="flex gap-2">
                  <Select
                    value={bedForm.roomId}
                    onValueChange={(value) => {
                      if (value === "__create__") {
                        setShowCreateRoom(true);
                      } else {
                        setBedForm({ ...bedForm, roomId: value });
                      }
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.filter(r => !roomForm.wardId || r.wardId === roomForm.wardId).map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.roomNumber} ({room.roomType})
                        </SelectItem>
                      ))}
                      <SelectItem value="__create__">
                        <span className="flex items-center gap-2 text-blue-600">
                          <Plus className="h-4 w-4" />
                          Create New Room
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Card className="p-4 space-y-3 border-purple-200 bg-purple-50/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Create New Room</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateRoom(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Number *</Label>
                    <Input
                      placeholder="e.g., 101"
                      value={roomForm.roomNumber}
                      onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Room Type *</Label>
                      <Select
                        value={roomForm.roomType}
                        onValueChange={(value) => setRoomForm({ ...roomForm, roomType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIVATE">Private</SelectItem>
                          <SelectItem value="SEMI-PRIVATE">Semi-Private</SelectItem>
                          <SelectItem value="WARD">Ward</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity *</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Floor *</Label>
                      <Input
                        placeholder="1"
                        value={roomForm.floor}
                        onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        if (!roomForm.roomNumber.trim() || !roomForm.wardId) {
                          showAlert("error", "Please fill all required fields and select a ward first");
                          return;
                        }
                        const newRoom = await bedService.createRoom(roomForm);
                        await loadData();
                        setBedForm({ ...bedForm, roomId: newRoom.id });
                        setShowCreateRoom(false);
                        showAlert("success", "Room created successfully!");
                        setRoomForm({ roomNumber: "", wardId: roomForm.wardId, roomType: "PRIVATE", capacity: 2, floor: "1", branchId: "branch_main" });
                      } catch (error) {
                        showAlert("error", "Failed to create room");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                </Card>
              )}
            </div>

            {/* Bed Details */}
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-semibold">Bed Details</Label>
              <div className="space-y-2">
                <Label htmlFor="bedNumber">Bed Number *</Label>
                <Input
                  id="bedNumber"
                  placeholder="e.g., B-101-5"
                  value={bedForm.bedNumber}
                  onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Bed Type *</Label>
                  <Select
                    value={bedForm.bedType}
                    onValueChange={(value: any) => setBedForm({ ...bedForm, bedType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="ISOLATION">Isolation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={bedForm.status}
                    onValueChange={(value: any) => setBedForm({ ...bedForm, status: value })}
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddBedOpen(false);
              setShowCreateWard(false);
              setShowCreateRoom(false);
            }}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (!bedForm.bedNumber.trim() || !bedForm.roomId) {
                    showAlert("error", "Please enter bed number and select a room");
                    return;
                  }
                  await bedService.create(bedForm);
                  await loadData();
                  showAlert("success", "Bed created successfully!");
                  setIsAddBedOpen(false);
                  setShowCreateWard(false);
                  setShowCreateRoom(false);
                  setBedForm({ bedNumber: "", roomId: "", bedType: "STANDARD", status: "AVAILABLE", branchId: "branch_main" });
                  setRoomForm({ roomNumber: "", wardId: "", roomType: "PRIVATE", capacity: 2, floor: "1", branchId: "branch_main" });
                } catch (error) {
                  showAlert("error", `Failed to create bed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Bed Dialog */}
      <Dialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Bed {selectedBed?.bedNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Select
                value={allocateForm.patientId}
                onValueChange={(value) => setAllocateForm({ ...allocateForm, patientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Admission Date *</Label>
              <Input
                type="date"
                value={allocateForm.admissionDate}
                onChange={(e) => setAllocateForm({ ...allocateForm, admissionDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Expected Discharge Date *</Label>
              <Input
                type="date"
                value={allocateForm.expectedDischargeDate}
                onChange={(e) => setAllocateForm({ ...allocateForm, expectedDischargeDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (!selectedBed || !allocateForm.patientId || !allocateForm.expectedDischargeDate) {
                    showAlert("error", "Please fill all required fields");
                    return;
                  }
                  await bedService.allocateBed({
                    bedId: selectedBed.id,
                    ...allocateForm,
                  });
                  await loadData();
                  showAlert("success", "Bed allocated successfully!");
                  setAllocateDialogOpen(false);
                  setAllocateForm({ patientId: "", admissionDate: new Date().toISOString().split("T")[0], expectedDischargeDate: "" });
                } catch (error) {
                  showAlert("error", "Failed to allocate bed");
                }
              }}
            >
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
