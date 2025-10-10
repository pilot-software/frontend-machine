import React, { useEffect, useRef } from "react";
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
import { LoadingState } from "@/components/ui/loading-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { AppointmentFormModal } from "@/components/features/appointments/AppointmentFormModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiAppointment, appointmentService } from "@/lib/services/appointment";
import { useApi } from "@/lib/hooks/useApi";
import { useModal } from "@/lib/hooks/useModal";
import {
  AppointmentDisplay,
  transformAppointmentToDisplay,
} from "@/lib/utils/data-transformers";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function AppointmentSystem() {
  const t = useTranslations("common");
  const { isOpen, mode, selectedId, closeModal } = useModal<string>("schedule");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const {
    execute: fetchAppointments,
    loading: appointmentsLoading,
    data: appointments,
    statusCode,
  } = useApi<(ApiAppointment & { patientName: string })[]>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !statusCode) {
      hasFetched.current = true;
      fetchAppointments(() =>
        appointmentService.getAppointmentsWithPatientNames()
      );
    }
  }, [fetchAppointments, statusCode]);

  const appointmentsList = appointments || [];
  const displayAppointments: AppointmentDisplay[] = (
    Array.isArray(appointmentsList) ? appointmentsList : []
  ).map(transformAppointmentToDisplay);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "routine":
        return User;
      case "consultation":
        return Phone;
      case "follow_up":
        return Video;
      case "urgent":
        return AlertCircle;
      case "surgery":
        return CalendarIcon;
      default:
        return CalendarIcon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "cancelled":
      case "no-show":
        return XCircle;
      case "confirmed":
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Appointment System
          </h2>
          <p className="text-muted-foreground mt-1">
            Schedule and manage patient appointments - Direct, Phone &amp; Video
          </p>
        </div>
        <Button onClick={() => router.push("/en/appointments/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Today's Stats */}
      <StatsCardGrid>
        <StatsCard
          title="Total Appointments"
          value={24}
          icon={CalendarIcon}
          color="text-blue-600"
          bgGradient="from-blue-500/10 to-blue-600/5"
        />
        <StatsCard
          title="Direct Visits"
          value={16}
          icon={User}
          color="text-green-600"
          bgGradient="from-green-500/10 to-green-600/5"
        />
        <StatsCard
          title="Phone Consultations"
          value={6}
          icon={Phone}
          color="text-purple-600"
          bgGradient="from-purple-500/10 to-purple-600/5"
        />
        <StatsCard
          title="Video Calls"
          value={2}
          icon={Video}
          color="text-orange-600"
          bgGradient="from-orange-500/10 to-orange-600/5"
        />
      </StatsCardGrid>

      {/* Appointment Management Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full bg-muted p-1">
            <TabsTrigger value="today" className="whitespace-nowrap">Today&apos;s Schedule</TabsTrigger>
            <TabsTrigger value="upcoming" className="whitespace-nowrap">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar" className="whitespace-nowrap">Calendar View</TabsTrigger>
            <TabsTrigger value="history" className="whitespace-nowrap">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments by patient, doctor, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    All Types
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Direct
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {t("phone")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Appointments - July 26, 2024</CardTitle>
              <CardDescription>
                All scheduled appointments for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <LoadingState message="Loading appointments..." />
              ) : (
                <div className="space-y-4">
                  {displayAppointments.map((appointment) => {
                    const TypeIcon = getTypeIcon(appointment.type);
                    const StatusIcon = getStatusIcon(appointment.status);

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-muted rounded-full">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {appointment.time}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {appointment.duration} min
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">
                                {appointment.patientName}
                              </h3>
                              <StatusBadge status={appointment.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctorName} •{" "}
                              {appointment.department}
                            </p>
                            <p className="text-sm text-muted-foreground opacity-70">
                              {appointment.reason}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {appointment.type === "consultation" && (
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Patient
                            </Button>
                          )}
                          {appointment.type === "follow_up" && (
                            <Button variant="outline" size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Start Video
                            </Button>
                          )}
                          {(appointment.type === "routine" ||
                            appointment.type === "surgery") && (
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              Room Info
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <StatusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {displayAppointments.length === 0 && !appointmentsLoading && (
                    <LoadingState
                      message="No appointments found"
                      className="text-center"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Appointments scheduled for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upcoming appointments will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Monthly calendar with appointment overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Calendar interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>
                Past appointments and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Appointment history will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={isOpen}
        onClose={closeModal}
        appointmentId={selectedId}
        mode={mode as any}
        onSuccess={() =>
          fetchAppointments(() =>
            appointmentService.getAppointmentsWithPatientNames()
          )
        }
      />
    </div>
  );
}
