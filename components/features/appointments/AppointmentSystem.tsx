"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatsCard, StatsCardGrid } from "@/components/ui/stats-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar as CalendarIcon, CheckCircle2, Clock, Filter, MapPin, Phone, Plus, Search, User, Video, XCircle, Edit, Trash2, Eye, Bell, FileText, Users } from "lucide-react";
import { format, addDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  duration: number;
  type: "routine" | "consultation" | "follow_up" | "urgent" | "surgery";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  reason: string;
  notes?: string;
  roomNumber?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const STATIC_APPOINTMENTS: Appointment[] = [
  { id: "A001", patientId: "P001", patientName: "John Smith", patientPhone: "+1-555-0101", doctorId: "D001", doctorName: "Dr. Sarah Johnson", department: "Cardiology", date: new Date(), time: "09:00", duration: 30, type: "routine", status: "confirmed", reason: "Regular checkup", roomNumber: "101", priority: "medium" },
  { id: "A002", patientId: "P002", patientName: "Emma Wilson", patientPhone: "+1-555-0102", doctorId: "D002", doctorName: "Dr. Michael Chen", department: "Pediatrics", date: new Date(), time: "09:30", duration: 45, type: "consultation", status: "scheduled", reason: "Fever and cough", priority: "high" },
  { id: "A003", patientId: "P003", patientName: "Robert Brown", patientPhone: "+1-555-0103", doctorId: "D001", doctorName: "Dr. Sarah Johnson", department: "Cardiology", date: new Date(), time: "10:30", duration: 30, type: "follow_up", status: "confirmed", reason: "Post-surgery follow-up", roomNumber: "101", priority: "high" },
  { id: "A004", patientId: "P004", patientName: "Lisa Anderson", patientPhone: "+1-555-0104", doctorId: "D003", doctorName: "Dr. James Wilson", department: "Orthopedics", date: new Date(), time: "11:00", duration: 60, type: "urgent", status: "in-progress", reason: "Knee pain", roomNumber: "203", priority: "urgent" },
  { id: "A005", patientId: "P005", patientName: "David Martinez", patientPhone: "+1-555-0105", doctorId: "D004", doctorName: "Dr. Emily Davis", department: "Dermatology", date: new Date(), time: "14:00", duration: 30, type: "routine", status: "scheduled", reason: "Skin rash", priority: "low" },
  { id: "A006", patientId: "P006", patientName: "Sarah Taylor", patientPhone: "+1-555-0106", doctorId: "D002", doctorName: "Dr. Michael Chen", department: "Pediatrics", date: new Date(), time: "15:00", duration: 30, type: "consultation", status: "confirmed", reason: "Vaccination", roomNumber: "105", priority: "medium" },
  { id: "A007", patientId: "P007", patientName: "James Lee", patientPhone: "+1-555-0107", doctorId: "D005", doctorName: "Dr. Anna White", department: "Neurology", date: addDays(new Date(), 1), time: "09:00", duration: 45, type: "routine", status: "scheduled", reason: "Headache consultation", priority: "medium" },
  { id: "A008", patientId: "P008", patientName: "Maria Garcia", patientPhone: "+1-555-0108", doctorId: "D001", doctorName: "Dr. Sarah Johnson", department: "Cardiology", date: addDays(new Date(), 1), time: "10:00", duration: 30, type: "follow_up", status: "scheduled", reason: "Blood pressure check", priority: "high" },
  { id: "A009", patientId: "P009", patientName: "William Clark", patientPhone: "+1-555-0109", doctorId: "D003", doctorName: "Dr. James Wilson", department: "Orthopedics", date: addDays(new Date(), 2), time: "11:00", duration: 60, type: "surgery", status: "scheduled", reason: "Knee surgery", roomNumber: "OR-1", priority: "urgent" },
  { id: "A010", patientId: "P010", patientName: "Jennifer Moore", patientPhone: "+1-555-0110", doctorId: "D004", doctorName: "Dr. Emily Davis", department: "Dermatology", date: addDays(new Date(), 3), time: "14:30", duration: 30, type: "routine", status: "scheduled", reason: "Mole examination", priority: "low" },
];

export function AppointmentSystem() {
  const [appointments, setAppointments] = useState<Appointment[]>(STATIC_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = searchTerm === "" || 
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || apt.type === filterType;
      const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [appointments, searchTerm, filterType, filterStatus]);

  const todayAppointments = filteredAppointments.filter(apt => isSameDay(apt.date, new Date()));
  const upcomingAppointments = filteredAppointments.filter(apt => apt.date > new Date() && apt.date <= addDays(new Date(), 7));
  const selectedDateAppointments = filteredAppointments.filter(apt => isSameDay(apt.date, selectedDate));

  const stats = {
    total: todayAppointments.length,
    direct: todayAppointments.filter(a => a.type === "routine" || a.type === "surgery").length,
    phone: todayAppointments.filter(a => a.type === "consultation").length,
    video: todayAppointments.filter(a => a.type === "follow_up").length,
    confirmed: todayAppointments.filter(a => a.status === "confirmed").length,
    pending: todayAppointments.filter(a => a.status === "scheduled").length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "routine": return User;
      case "consultation": return Phone;
      case "follow_up": return Video;
      case "urgent": return AlertCircle;
      case "surgery": return CalendarIcon;
      default: return CalendarIcon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle2;
      case "cancelled":
      case "no-show": return XCircle;
      case "confirmed": return CheckCircle2;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleCreateAppointment = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (apt: Appointment) => {
    setModalMode("edit");
    setSelectedAppointment(apt);
    setIsModalOpen(true);
  };

  const handleViewAppointment = (apt: Appointment) => {
    setModalMode("view");
    setSelectedAppointment(apt);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      ));
    }
  };

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate),
    end: endOfWeek(selectedDate)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Appointment System</h2>
          <p className="text-muted-foreground mt-1">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={handleCreateAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      <StatsCardGrid>
        <StatsCard title="Total Appointments" value={stats.total} icon={CalendarIcon} color="text-blue-600" bgGradient="from-blue-500 to-blue-600" />
        <StatsCard title="Direct Visits" value={stats.direct} icon={User} color="text-green-600" bgGradient="from-green-500 to-green-600" />
        <StatsCard title="Phone Consultations" value={stats.phone} icon={Phone} color="text-purple-600" bgGradient="from-purple-500 to-purple-600" />
        <StatsCard title="Video Calls" value={stats.video} icon={Video} color="text-orange-600" bgGradient="from-orange-500 to-orange-600" />
      </StatsCardGrid>

      <Tabs defaultValue="today" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full bg-muted p-1">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by patient, doctor, or reason..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setFilterType("all"); setFilterStatus("all"); }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments - {format(new Date(), "MMMM d, yyyy")}</CardTitle>
              <CardDescription>{todayAppointments.length} appointments scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((apt) => {
                  const TypeIcon = getTypeIcon(apt.type);
                  const StatusIcon = getStatusIcon(apt.status);
                  return (
                    <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-muted rounded-full">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{apt.time}</p>
                            <p className="text-xs text-muted-foreground">{apt.duration} min</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{apt.patientName}</h3>
                            <StatusBadge status={apt.status} />
                            <Badge className={getPriorityColor(apt.priority)}>{apt.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.doctorName} • {apt.department}</p>
                          <p className="text-sm text-muted-foreground">{apt.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.roomNumber && <Badge variant="outline">{apt.roomNumber}</Badge>}
                        <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(apt)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(apt)}><Edit className="h-4 w-4" /></Button>
                        <Select value={apt.status} onValueChange={(val) => handleStatusChange(apt.id, val as Appointment["status"])}>
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no-show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
                {todayAppointments.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments found for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next 7 days - {upcomingAppointments.length} appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{format(apt.date, "d")}</p>
                        <p className="text-xs text-muted-foreground">{format(apt.date, "MMM")}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{apt.patientName}</h3>
                          <Badge className={getPriorityColor(apt.priority)}>{apt.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{apt.time} • {apt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewAppointment(apt)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditAppointment(apt)}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} className="rounded-md border" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Appointments on {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                <CardDescription>{selectedDateAppointments.length} appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{apt.time}</p>
                          <h3 className="font-medium">{apt.patientName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{apt.doctorName} • {apt.reason}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                  {selectedDateAppointments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No appointments on this date</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Past appointments and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Appointment history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        appointment={selectedAppointment}
        onSave={(apt) => {
          if (modalMode === "create") {
            setAppointments(prev => [...prev, { ...apt, id: `A${Date.now()}` }]);
          } else if (modalMode === "edit" && selectedAppointment) {
            setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? apt : a));
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  appointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
}

function AppointmentModal({ isOpen, onClose, mode, appointment, onSave }: AppointmentModalProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>(
    appointment || {
      patientName: "",
      patientPhone: "",
      doctorName: "",
      department: "",
      date: new Date(),
      time: "09:00",
      duration: 30,
      type: "routine",
      status: "scheduled",
      reason: "",
      notes: "",
      roomNumber: "",
      priority: "medium",
    }
  );

  const handleSubmit = () => {
    onSave(formData as Appointment);
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Schedule New Appointment" : mode === "edit" ? "Edit Appointment" : "Appointment Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new appointment" : mode === "edit" ? "Update appointment details" : "View appointment information"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Patient Name *</Label>
              <Input value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} disabled={isReadOnly} />
            </div>
            <div>
              <Label>Patient Phone</Label>
              <Input value={formData.patientPhone} onChange={(e) => setFormData({...formData, patientPhone: e.target.value})} disabled={isReadOnly} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Doctor Name *</Label>
              <Input value={formData.doctorName} onChange={(e) => setFormData({...formData, doctorName: e.target.value})} disabled={isReadOnly} />
            </div>
            <div>
              <Label>Department *</Label>
              <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} disabled={isReadOnly} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Time *</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} disabled={isReadOnly} />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Select value={formData.duration?.toString()} onValueChange={(val) => setFormData({...formData, duration: parseInt(val)})} disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Room Number</Label>
              <Input value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} disabled={isReadOnly} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as Appointment["type"]})} disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority *</Label>
              <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val as Appointment["priority"]})} disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val as Appointment["status"]})} disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Reason for Visit *</Label>
            <Textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Additional Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} disabled={isReadOnly} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {!isReadOnly && <Button onClick={handleSubmit}>{mode === "create" ? "Schedule" : "Update"}</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
