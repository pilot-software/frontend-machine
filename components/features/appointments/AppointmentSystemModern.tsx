"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { ApiAppointment, appointmentService } from "@/lib/services/appointment";
import { useApi } from "@/lib/hooks/useApi";
import { AppointmentDisplay, transformAppointmentToDisplay } from "@/lib/utils/data-transformers";
import { useAuth } from "@/components/providers/AuthContext";
import { ROLES } from "@/lib/constants";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Phone,
  Video,
  MapPin,
  Search,
  Plus,
  Bell,
  Activity,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function AppointmentSystemModern() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { execute: fetchAppointments, loading, data: appointments } = useApi<(ApiAppointment & { patientName: string })[]>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAppointments(() => appointmentService.getAppointmentsWithPatientNames());
    }
  }, [fetchAppointments]);

  const appointmentsList = appointments || [];
  const displayAppointments: AppointmentDisplay[] = appointmentsList.map(transformAppointmentToDisplay);

  const todayAppointments = displayAppointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const stats = [
    {
      title: "Total Today",
      value: todayAppointments.length,
      change: "+12%",
      trend: "up" as const,
      icon: CalendarIcon,
      bgGradient: "from-blue-500 to-blue-600",
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: todayAppointments.filter(a => a.status === "completed").length,
      change: "+8%",
      trend: "up" as const,
      icon: CheckCircle2,
      bgGradient: "from-green-500 to-green-600",
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: todayAppointments.filter(a => a.status === "confirmed").length,
      change: "0%",
      trend: "neutral" as const,
      icon: Activity,
      bgGradient: "from-orange-500 to-orange-600",
      color: "text-orange-600",
    },
    {
      title: "Pending",
      value: todayAppointments.filter(a => a.status === "scheduled").length,
      change: "-3%",
      trend: "down" as const,
      icon: Clock,
      bgGradient: "from-purple-500 to-purple-600",
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      "no-show": "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      routine: MapPin,
      consultation: Phone,
      follow_up: Video,
      urgent: AlertCircle,
    };
    return icons[type] || CalendarIcon;
  };

  const canManage = user?.role === ROLES.ADMIN || user?.role === ROLES.DOCTOR;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Appointment System
          </h2>
          <p className="text-muted-foreground mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canManage && (
            <Button onClick={() => router.push("/en/appointments/add")}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </StatsCardGrid>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, doctor, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={filterType === "routine" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("routine")}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Direct
                  </Button>
                  <Button
                    variant={filterType === "consultation" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("consultation")}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Phone
                  </Button>
                  <Button
                    variant={filterType === "follow_up" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("follow_up")}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Today's Schedule</CardTitle>
                  <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : todayAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No appointments scheduled for today</p>
                    </div>
                  ) : (
                    todayAppointments.map((appointment, idx) => {
                      const TypeIcon = getTypeIcon(appointment.type);
                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-muted rounded-full">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{appointment.time}</p>
                                <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <Badge variant="outline" className={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {user?.role !== ROLES.PATIENT && `${appointment.doctorName} • `}
                                {appointment.department}
                              </p>
                              <p className="text-sm text-muted-foreground opacity-70">{appointment.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment.type === "consultation" && (
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                            )}
                            {appointment.type === "follow_up" && (
                              <Button variant="outline" size="sm">
                                <Video className="h-4 w-4 mr-2" />
                                Join
                              </Button>
                            )}
                            {appointment.type === "routine" && (
                              <Button variant="outline" size="sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                Room
                              </Button>
                            )}
                            {canManage && (
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar & Quick Stats */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-sm font-semibold">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="text-sm font-semibold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">On-Time Rate</span>
                <span className="text-sm font-semibold">88%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
