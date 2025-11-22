import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/lib/constants";
import { AppointmentFormModal } from "@/components/features/appointments/AppointmentFormModal";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Edit,
  Eye,
  FileText,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Timer,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  endTime: string;
  type: "direct" | "phone" | "video";
  status:
    | "scheduled"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show"
    | "rescheduled";
  department: string;
  reason: string;
  duration: number;
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
  roomNumber?: string;
  meetingLink?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    patientPhone: "+1-555-0123",
    doctorId: "d1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-08-01",
    time: "09:00",
    endTime: "09:30",
    type: "direct",
    status: "scheduled",
    department: "Cardiology",
    reason: "Regular checkup - Hypertension follow-up",
    duration: 30,
    priority: "medium",
    roomNumber: "Room 204",
    notes: "Patient requests morning appointment",
    reminderSent: true,
    createdAt: "2024-07-25T10:30:00Z",
    updatedAt: "2024-07-25T10:30:00Z",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Emma Davis",
    patientEmail: "emma.davis@email.com",
    patientPhone: "+1-555-0124",
    doctorId: "d2",
    doctorName: "Dr. Michael Chen",
    date: "2024-08-01",
    time: "10:30",
    endTime: "10:45",
    type: "phone",
    status: "confirmed",
    department: "Emergency",
    reason: "Post-ER follow-up consultation",
    duration: 15,
    priority: "high",
    notes: "Patient recovering from chest pain episode",
    reminderSent: true,
    createdAt: "2024-07-24T15:20:00Z",
    updatedAt: "2024-07-26T09:15:00Z",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Michael Johnson",
    patientEmail: "michael.johnson@email.com",
    patientPhone: "+1-555-0125",
    doctorId: "d3",
    doctorName: "Dr. Emily Rodriguez",
    date: "2024-08-01",
    time: "14:00",
    endTime: "14:20",
    type: "video",
    status: "scheduled",
    department: "Orthopedics",
    reason: "Post-surgery follow-up - Knee replacement",
    duration: 20,
    priority: "medium",
    meetingLink: "https://meet.hospital.com/room/ortho-001",
    notes: "Patient prefers video due to mobility issues",
    reminderSent: false,
    createdAt: "2024-07-23T11:45:00Z",
    updatedAt: "2024-07-23T11:45:00Z",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Sarah Wilson",
    patientEmail: "sarah.wilson@email.com",
    patientPhone: "+1-555-0126",
    doctorId: "d1",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-08-01",
    time: "15:30",
    endTime: "16:00",
    type: "direct",
    status: "in-progress",
    department: "Cardiology",
    reason: "Chest pain evaluation - URGENT",
    duration: 30,
    priority: "urgent",
    roomNumber: "Room 204",
    notes: "Patient experiencing chest discomfort",
    reminderSent: true,
    createdAt: "2024-08-01T08:30:00Z",
    updatedAt: "2024-08-01T15:25:00Z",
  },
];

export function AppointmentSystemEnhanced() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "schedule" | "reschedule" | "view"
  >("schedule");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<
    "all" | "direct" | "phone" | "video"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "scheduled" | "confirmed" | "completed" | "cancelled"
  >("all");

  // Filter appointments based on user role
  const getFilteredAppointments = () => {
    let filtered = mockAppointments;

    // Role-based filtering
    if (user?.role === ROLES.DOCTOR) {
      filtered = filtered.filter((apt) => apt.doctorId === user.id);
    } else if (user?.role === ROLES.PATIENT) {
      filtered = filtered.filter((apt) => apt.patientEmail === user.email);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filtering
    if (selectedType !== "all") {
      filtered = filtered.filter((apt) => apt.type === selectedType);
    }

    // Status filtering
    if (selectedStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === selectedStatus);
    }

    return filtered;
  };

  const todayAppointments = getFilteredAppointments().filter(
    (apt) => apt.date === "2024-08-01"
  );
  const upcomingAppointments = getFilteredAppointments().filter(
    (apt) => apt.date > "2024-08-01"
  );
  const completedAppointments = getFilteredAppointments().filter(
    (apt) => apt.status === "completed"
  );

  const todayStats = [
    {
      label: "Total Today",
      value: todayAppointments.length.toString(),
      icon: CalendarIcon,
      color: "text-blue-600",
      change: "+12%",
    },
    {
      label: "Direct Visits",
      value: todayAppointments
        .filter((apt) => apt.type === "direct")
        .length.toString(),
      icon: User,
      color: "text-green-600",
      change: "+5%",
    },
    {
      label: "Phone Calls",
      value: todayAppointments
        .filter((apt) => apt.type === "phone")
        .length.toString(),
      icon: Phone,
      color: "text-purple-600",
      change: "+8%",
    },
    {
      label: "Video Calls",
      value: todayAppointments
        .filter((apt) => apt.type === "video")
        .length.toString(),
      icon: Video,
      color: "text-orange-600",
      change: "+3%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      case "rescheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "direct":
        return User;
      case "phone":
        return Phone;
      case "video":
        return Video;
      default:
        return CalendarIcon;
    }
  };

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "cancelled":
      case "no-show":
        return XCircle;
      case "confirmed":
        return CheckCircle2;
      case "in-progress":
        return Timer;
      case "rescheduled":
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const getTimeSlots = () => {
    const slots: AppointmentSlot[] = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const appointment = todayAppointments.find((apt) => apt.time === time);

        slots.push({
          time,
          available: !appointment,
          appointmentId: appointment?.id,
        });
      }
    }

    return slots;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const canScheduleAppointments =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.NURSE ||
    user?.role === ROLES.DOCTOR;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Appointment System</h2>
          <p>
            {user?.role === ROLES.PATIENT
              ? "View and manage your appointments"
              : user?.role === ROLES.DOCTOR
              ? "Manage your patient appointments"
              : "Complete appointment management system"}
          </p>
        </div>
        {canScheduleAppointments && (
          <Button
            onClick={() => {
              setModalMode("schedule");
              setSelectedAppointmentId(undefined);
              setIsAppointmentModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointmentsssssss
          </Button>
        )}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p>{stat.label}</p>
                    <p className="mt-1">{stat.value}</p>
                    <p
                      className={`mt-1 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Appointment Management Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full lg:w-auto lg:inline-flex lg:h-10 grid-cols-5">
          <TabsTrigger value="today">Today&apos;s Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={
                      user?.role === ROLES.PATIENT
                        ? "Search your appointments..."
                        : "Search appointments by patient, doctor, or reason..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={selectedType}
                    onValueChange={(value) =>
                      setSelectedType(value as typeof selectedType)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="phone">{t("phone")}</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setSelectedStatus(value as typeof selectedStatus)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">
                        {t("completed")}
                      </SelectItem>
                      <SelectItem value="cancelled">
                        {t("cancelled")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Today&apos;s Appointments -{" "}
                    {new Date().toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>
                    {todayAppointments.length} appointments scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => {
                      const TypeIcon = getTypeIcon(appointment.type);

                      return (
                        <div
                          key={appointment.id}
                          className={`p-4 border rounded-lg ${
                            appointment.priority === "urgent"
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 bg-slate-100 rounded-full">
                                  <TypeIcon className="h-4 w-4 text-slate-600" />
                                </div>
                                <div>
                                  <p>{formatTime(appointment.time)}</p>
                                  <p>{appointment.duration} min</p>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3>{appointment.patientName}</h3>
                                  <Badge
                                    className={getStatusColor(
                                      appointment.status
                                    )}
                                  >
                                    {appointment.status}
                                  </Badge>
                                  {appointment.priority === "urgent" && (
                                    <Badge
                                      className={getPriorityColor(
                                        appointment.priority
                                      )}
                                    >
                                      URGENT
                                    </Badge>
                                  )}
                                </div>
                                <p className="mb-1">
                                  {user?.role !== "doctor" &&
                                    `${appointment.doctorName} • `}
                                  {appointment.department}
                                </p>
                                <p className="mb-1">{appointment.reason}</p>
                                {appointment.notes && (
                                  <p className="italic">{appointment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {appointment.type === "phone" &&
                                appointment.status === "confirmed" && (
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call
                                  </Button>
                                )}
                              {appointment.type === "video" &&
                                appointment.status === "confirmed" && (
                                  <Button variant="outline" size="sm">
                                    <Video className="h-4 w-4 mr-2" />
                                    Join
                                  </Button>
                                )}
                              {appointment.type === "direct" && (
                                <Button variant="outline" size="sm">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {appointment.roomNumber}
                                </Button>
                              )}
                              {canScheduleAppointments && (
                                <>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {todayAppointments.length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p>No appointments scheduled for today</p>
                        <p>The schedule is clear</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Schedule Overview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Time Slots</CardTitle>
                  <CardDescription>Available slots for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getTimeSlots()
                      .slice(0, 20)
                      .map((slot) => (
                        <div
                          key={slot.time}
                          className={`p-2 rounded text-sm ${
                            slot.available
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{formatTime(slot.time)}</span>
                            <span className="text-xs">
                              {slot.available ? "Available" : "Booked"}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Appointments scheduled for the next 30 days (
                {upcomingAppointments.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>{t("patient")}</TableHead>
                    <TableHead>{t("doctor")}</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.slice(0, 10).map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p>
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatTime(appointment.time)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{appointment.patientName}</p>
                            <p className="text-xs text-slate-500">
                              {appointment.patientPhone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {React.createElement(getTypeIcon(appointment.type), {
                            className: "h-4 w-4",
                          })}
                          <span className="capitalize">{appointment.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(appointment.priority)}
                        >
                          {appointment.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canScheduleAppointments && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p>No upcoming appointments</p>
                  <p>Schedule new appointments to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Select a date to view appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Appointments for {selectedDate?.toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>Daily schedule overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Show appointments for selected date */}
                    <p>
                      Calendar view appointments will be displayed here based on
                      selected date.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>
                Past appointments and their outcomes (
                {completedAppointments.length} completed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAppointments.slice(0, 10).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3>{appointment.patientName}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            {t("completed")}
                          </Badge>
                        </div>
                        <p>
                          {appointment.doctorName} • {appointment.department}
                        </p>
                        <p>
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {formatTime(appointment.time)}
                        </p>
                        <p>{appointment.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {completedAppointments.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p>No appointment history</p>
                    <p>Completed appointments will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Statistics</CardTitle>
                <CardDescription>Monthly overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Appointments</span>
                    <span>156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("completed")}</span>
                    <span className="text-green-600">142 (91%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>No-shows</span>
                    <span className="text-red-600">8 (5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("cancelled")}</span>
                    <span className="text-orange-600">6 (4%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Time Slots</CardTitle>
                <CardDescription>
                  Most requested appointment times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>9:00 AM - 10:00 AM</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-200 rounded">
                        <div className="w-16 h-2 bg-blue-500 rounded"></div>
                      </div>
                      <span>24</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>10:00 AM - 11:00 AM</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-200 rounded">
                        <div className="w-14 h-2 bg-blue-500 rounded"></div>
                      </div>
                      <span>18</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2:00 PM - 3:00 PM</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-200 rounded">
                        <div className="w-12 h-2 bg-blue-500 rounded"></div>
                      </div>
                      <span>15</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointmentId={selectedAppointmentId}
        mode={modalMode}
      />
    </div>
  );
}
