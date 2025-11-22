"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Video,
  Search,
  Plus,
  Edit,
  Eye,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  BedDouble,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import {
  format,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  duration: number;
  type: "routine" | "consultation" | "follow_up" | "urgent" | "surgery";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  roomNumber?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const STATIC_DATA: Appointment[] = [
  {
    id: "A001",
    patientName: "John Smith",
    patientPhone: "+1-555-0101",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: new Date(),
    time: "09:00",
    duration: 30,
    type: "routine",
    status: "confirmed",
    reason: "Regular checkup",
    roomNumber: "101",
    priority: "medium",
  },
  {
    id: "A002",
    patientName: "Emma Wilson",
    patientPhone: "+1-555-0102",
    doctorName: "Dr. Michael Chen",
    department: "Pediatrics",
    date: new Date(),
    time: "09:30",
    duration: 45,
    type: "consultation",
    status: "scheduled",
    reason: "Fever and cough",
    priority: "high",
  },
  {
    id: "A003",
    patientName: "Robert Brown",
    patientPhone: "+1-555-0103",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: new Date(),
    time: "10:30",
    duration: 30,
    type: "follow_up",
    status: "confirmed",
    reason: "Post-surgery follow-up",
    roomNumber: "101",
    priority: "high",
  },
  {
    id: "A004",
    patientName: "Lisa Anderson",
    patientPhone: "+1-555-0104",
    doctorName: "Dr. James Wilson",
    department: "Orthopedics",
    date: new Date(),
    time: "11:00",
    duration: 60,
    type: "urgent",
    status: "in-progress",
    reason: "Knee pain",
    roomNumber: "203",
    priority: "urgent",
  },
  {
    id: "A005",
    patientName: "David Martinez",
    patientPhone: "+1-555-0105",
    doctorName: "Dr. Emily Davis",
    department: "Dermatology",
    date: new Date(),
    time: "14:00",
    duration: 30,
    type: "routine",
    status: "scheduled",
    reason: "Skin rash",
    priority: "low",
  },
  {
    id: "A006",
    patientName: "Sarah Taylor",
    patientPhone: "+1-555-0106",
    doctorName: "Dr. Michael Chen",
    department: "Pediatrics",
    date: new Date(),
    time: "15:00",
    duration: 30,
    type: "consultation",
    status: "confirmed",
    reason: "Vaccination",
    roomNumber: "105",
    priority: "medium",
  },
  {
    id: "A007",
    patientName: "James Lee",
    patientPhone: "+1-555-0107",
    doctorName: "Dr. Anna White",
    department: "Neurology",
    date: addDays(new Date(), 1),
    time: "09:00",
    duration: 45,
    type: "routine",
    status: "scheduled",
    reason: "Headache consultation",
    priority: "medium",
  },
  {
    id: "A008",
    patientName: "Maria Garcia",
    patientPhone: "+1-555-0108",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: addDays(new Date(), 2),
    time: "10:00",
    duration: 30,
    type: "follow_up",
    status: "scheduled",
    reason: "Blood pressure check",
    priority: "high",
  },
  {
    id: "A009",
    patientName: "Tom Wilson",
    patientPhone: "+1-555-0109",
    doctorName: "Dr. James Wilson",
    department: "Orthopedics",
    date: addDays(new Date(), 3),
    time: "11:00",
    duration: 60,
    type: "surgery",
    status: "scheduled",
    reason: "Knee surgery",
    roomNumber: "OR-1",
    priority: "urgent",
  },
  {
    id: "A010",
    patientName: "Anna Davis",
    patientPhone: "+1-555-0110",
    doctorName: "Dr. Emily Davis",
    department: "Dermatology",
    date: addDays(new Date(), 5),
    time: "14:30",
    duration: 30,
    type: "routine",
    status: "scheduled",
    reason: "Skin check",
    priority: "low",
  },
];

export function AppointmentSystemModern() {
  const t = useTranslations("common");
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(STATIC_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<
    Appointment[]
  >([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        searchTerm === "" ||
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || apt.type === filterType;
      const matchesStatus =
        filterStatus === "all" || apt.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [appointments, searchTerm, filterType, filterStatus]);

  const todayAppointments = filteredAppointments.filter((apt) =>
    isSameDay(apt.date, new Date())
  );

  const stats = {
    total: todayAppointments.length,
    completed: todayAppointments.filter((a) => a.status === "completed").length,
    inProgress: todayAppointments.filter((a) => a.status === "in-progress")
      .length,
    pending: todayAppointments.filter((a) => a.status === "scheduled").length,
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      routine: MapPin,
      consultation: Phone,
      follow_up: Video,
      urgent: AlertCircle,
      surgery: CalendarIcon,
    };
    return icons[type as keyof typeof icons] || CalendarIcon;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-700",
      confirmed: "bg-green-100 text-green-700",
      "in-progress": "bg-orange-100 text-orange-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-red-50 text-red-600 border-red-200",
      high: "bg-orange-50 text-orange-600 border-orange-200",
      medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
      low: "bg-green-50 text-green-600 border-green-200",
    };
    return colors[priority] || "bg-gray-50 text-gray-600";
  };

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleScheduleAppointment = () => {
    router.push("/appointments/add");
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter((apt) => isSameDay(apt.date, day));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t("appointmentSystem")}</h2>
          <p className="text-muted-foreground mt-1">
            {t("scheduleManageAppointments")}
          </p>
        </div>
        <Button
          onClick={() => {
            handleScheduleAppointment();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("scheduleAppointments")}
        </Button>
      </div>

      <StatsCardGrid>
        <StatsCard
          title={t("totalToday")}
          value={stats.total}
          icon={CalendarIcon}
          color="text-blue-600"
          bgGradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title={t("completed")}
          value={stats.completed}
          icon={CheckCircle2}
          color="text-green-600"
          bgGradient="from-green-500 to-green-600"
        />
        <StatsCard
          title={t("inProgress")}
          value={stats.inProgress}
          icon={Activity}
          color="text-orange-600"
          bgGradient="from-orange-500 to-orange-600"
        />
        <StatsCard
          title={t("pending")}
          value={stats.pending}
          icon={Clock}
          color="text-purple-600"
          bgGradient="from-purple-500 to-purple-600"
        />
      </StatsCardGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="hidden md:block">
          <TabsList>
            <TabsTrigger value="today">{t("todayTab")}</TabsTrigger>
            <TabsTrigger value="calendar">{t("calendarViewTab")}</TabsTrigger>
            <TabsTrigger value="upcoming">
              {t("upcomingAppointmentsTab")}
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t("todaysSchedule")}</SelectItem>
              <SelectItem value="calendar">{t("calendarViewTab")}</SelectItem>
              <SelectItem value="upcoming">
                {t("upcomingAppointmentsTab")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchByPatientDoctorReason")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allTypes")}</SelectItem>
                      <SelectItem value="routine">{t("routine")}</SelectItem>
                      <SelectItem value="consultation">
                        {t("consultation")}
                      </SelectItem>
                      <SelectItem value="follow_up">{t("followUp")}</SelectItem>
                      <SelectItem value="urgent">{t("urgent")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allStatus")}</SelectItem>
                      <SelectItem value="scheduled">
                        {t("scheduled")}
                      </SelectItem>
                      <SelectItem value="confirmed">
                        {t("confirmed")}
                      </SelectItem>
                      <SelectItem value="in-progress">
                        {t("inProgress")}
                      </SelectItem>
                      <SelectItem value="completed">
                        {t("completed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                      setFilterStatus("all");
                    }}
                  >
                    {t("clearFilters")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("todaysSchedule")} - {format(new Date(), "MMMM d, yyyy")}
              </CardTitle>
              <CardDescription>
                {todayAppointments.length} {t("appointments")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((apt) => {
                  const TypeIcon = getTypeIcon(apt.type);
                  return (
                    <div
                      key={apt.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-full">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{apt.time}</p>
                            <p className="text-xs text-muted-foreground">
                              {apt.duration}m
                            </p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{apt.patientName}</h3>
                            <Badge className={getStatusColor(apt.status)}>
                              {apt.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(apt.priority)}
                            >
                              {apt.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {apt.doctorName} • {apt.department}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {apt.reason}
                          </p>
                          {apt.roomNumber && (
                            <p className="text-xs text-muted-foreground sm:hidden flex items-center gap-1 mt-1">
                              <BedDouble className="h-3 w-3" />
                              {t("roomNumber")} {apt.roomNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {apt.roomNumber && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="hidden sm:inline-flex gap-1 cursor-help"
                                >
                                  <BedDouble className="h-3 w-3" />
                                  {t("roomNumber")} {apt.roomNumber}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("roomBedNumber")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setModalMode("view");
                                  setSelectedAppointment(apt);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("viewDetails")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:inline-flex"
                                onClick={() => {
                                  setModalMode("edit");
                                  setSelectedAppointment(apt);
                                  setIsModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("editAppointment")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                onClick={() =>
                                  router.push(
                                    `/prescriptions/add?patient=${encodeURIComponent(
                                      apt.patientName
                                    )}&appointmentId=${apt.id}`
                                  )
                                }
                              >
                                <FileText className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">
                                  {t("addPrescription")}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("addPrescription")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Select
                          value={apt.status}
                          onValueChange={(val) =>
                            handleStatusChange(
                              apt.id,
                              val as Appointment["status"]
                            )
                          }
                        >
                          <SelectTrigger className="w-[110px] sm:w-[130px] h-8 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">
                              {t("scheduled")}
                            </SelectItem>
                            <SelectItem value="confirmed">
                              {t("confirmed")}
                            </SelectItem>
                            <SelectItem value="in-progress">
                              {t("inProgress")}
                            </SelectItem>
                            <SelectItem value="completed">
                              {t("completed")}
                            </SelectItem>
                            <SelectItem value="cancelled">
                              {t("cancelled")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
                {todayAppointments.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t("noAppointmentsFound")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, idx) => (
                    <div
                      key={idx}
                      className="text-center font-semibold text-xs sm:text-sm py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {calendarDays.map((day, idx) => {
                  const dayAppointments = getAppointmentsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  return (
                    <div
                      key={idx}
                      className={`min-h-[80px] sm:min-h-[120px] border rounded-lg p-1 sm:p-2 ${
                        isCurrentMonth ? "bg-background" : "bg-muted/30"
                      } ${isToday ? "ring-2 ring-primary" : ""}`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday
                            ? "text-primary"
                            : isCurrentMonth
                            ? ""
                            : "text-muted-foreground"
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-1 rounded cursor-pointer ${getStatusColor(
                              apt.status
                            )}`}
                            onClick={() => {
                              setModalMode("view");
                              setSelectedAppointment(apt);
                              setIsModalOpen(true);
                            }}
                          >
                            <div className="font-medium truncate">
                              {apt.time} {apt.patientName}
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div
                            className="text-xs text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              setSelectedDayAppointments(dayAppointments);
                              setIsDayModalOpen(true);
                            }}
                          >
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>{t("upcomingAppointmentsTab")}</CardTitle>
              <CardDescription>{t("nextDays")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAppointments
                  .filter((apt) => apt.date > new Date())
                  .slice(0, 10)
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold">
                            {format(apt.date, "d")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(apt.date, "MMM")}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{apt.patientName}</h3>
                            <Badge className={getPriorityColor(apt.priority)}>
                              {apt.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {apt.time} • {apt.doctorName}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setModalMode("view");
                          setSelectedAppointment(apt);
                          setIsModalOpen(true);
                        }}
                      >
                        {t("view")}
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("allAppointments")} -{" "}
              {selectedDayAppointments.length > 0 &&
                format(selectedDayAppointments[0].date, "MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              {selectedDayAppointments.length} {t("appointmentsScheduled")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setModalMode("view");
                  setSelectedAppointment(apt);
                  setIsDayModalOpen(false);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{apt.time}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{apt.patientName}</h3>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.doctorName} • {apt.reason}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getPriorityColor(apt.priority)}
                >
                  {apt.priority}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
