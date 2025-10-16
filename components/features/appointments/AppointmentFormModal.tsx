import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROLES } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Save,
  Stethoscope,
  User,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { cn } from '@/components/ui/utils';
import { format } from "date-fns";
import { appointmentService } from '@/lib/services/appointment';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchDoctors, fetchPatients } from '@/lib/store/slices/appSlice';

interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  chiefComplaint: string;
  notes: string;
  roomNumber: string;
}

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  mode: "schedule" | "reschedule" | "view";
  preSelectedPatientId?: string;
  onSuccess?: () => void;
}

export function AppointmentFormModal({
  isOpen,
  onClose,
  appointmentId,
  mode,
  preSelectedPatientId,
  onSuccess,
}: AppointmentFormModalProps) {
  const t = useTranslations('common');
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { patients, doctors, loading } = useAppSelector((state) => state.app);
  const patientsLoading = loading.patients;
  const doctorsLoading = loading.doctors;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [appointmentData, setAppointmentData] = useState<AppointmentFormData>({
    patientId: preSelectedPatientId || "",
    doctorId: user?.role === ROLES.DOCTOR ? user.id : "",
    appointmentDate: "",
    appointmentTime: "",
    durationMinutes: 30,
    chiefComplaint: "",
    notes: "",
    roomNumber: "",
  });

  const isLoadingData = patientsLoading || doctorsLoading;

  // Load patients and doctors when modal opens
  React.useEffect(() => {
    if (isOpen && patients.length === 0) {
      dispatch(fetchPatients());
    }
    if (isOpen && doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [isOpen, dispatch, patients.length, doctors.length]);

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const durations = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  const handleInputChange = (
    field: keyof AppointmentFormData,
    value: string | number
  ) => {
    setAppointmentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      try {
        // Ensure we have a valid date and format it properly
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;
        setAppointmentData((prev) => ({
          ...prev,
          appointmentDate: dateString,
        }));
      } catch (error) {
        console.error("Date formatting error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (
        !appointmentData.patientId ||
        !appointmentData.doctorId ||
        !appointmentData.appointmentDate ||
        !appointmentData.appointmentTime
      ) {
        alert(
          "Please fill in all required fields (Patient, Doctor, Date, Time)"
        );
        return;
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(appointmentData.appointmentDate)) {
        alert("Invalid date format. Please select a valid date.");
        return;
      }

      // Validate time format
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(appointmentData.appointmentTime)) {
        alert("Invalid time format. Please select a valid time.");
        return;
      }

      const apiData = {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        durationMinutes: appointmentData.durationMinutes || 30,
        status: "SCHEDULED" as const,
        chiefComplaint: appointmentData.chiefComplaint || undefined,
        notes: appointmentData.notes || undefined,
        roomNumber: appointmentData.roomNumber || undefined,
        createdBy: user?.id || "system",
      };

      console.log("Submitting appointment data:", apiData);

      if (mode === "schedule") {
        await appointmentService.createAppointment(apiData);
      } else if (mode === "reschedule" && appointmentId) {
        await appointmentService.updateAppointment(appointmentId, apiData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save appointment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Check for specific time-related errors
      if (
        errorMessage.includes("Invalid time") ||
        errorMessage.includes("time value")
      ) {
        alert(
          "Invalid date or time format. Please check your selections and try again."
        );
      } else {
        alert(`Failed to save appointment: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1200px] h-[500px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>
              {mode === "schedule"
                ? "Schedule New Appointment"
                : mode === "reschedule"
                ? "Reschedule Appointment"
                : "Appointment Details"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {mode === "schedule"
              ? "Create a new appointment for a patient"
              : mode === "reschedule"
              ? "Modify appointment date and time"
              : "View appointment information and details"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Appointment Form */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Information</CardTitle>
                  <CardDescription>
                    Basic appointment details and scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Patient *</Label>
                      <Select
                        value={appointmentData.patientId}
                        onValueChange={(value) =>
                          handleInputChange("patientId", value)
                        }
                        disabled={
                          isReadOnly || !!preSelectedPatientId || isLoadingData
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingData
                                ? "Loading patients..."
                                : "Select patient"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingData ? (
                            <SelectItem value="loading" disabled>
                              Loading patients...
                            </SelectItem>
                          ) : patients.length === 0 ? (
                            <SelectItem value="no-patients" disabled>
                              No patients available
                            </SelectItem>
                          ) : (
                            patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName} (
                                {patient.id})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="doctor">Doctor *</Label>
                      <Select
                        value={appointmentData.doctorId}
                        onValueChange={(value) =>
                          handleInputChange("doctorId", value)
                        }
                        disabled={
                          isReadOnly || user?.role === ROLES.DOCTOR || isLoadingData
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingData
                                ? "Loading doctors..."
                                : "Select doctor"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingData ? (
                            <SelectItem value="loading" disabled>
                              Loading doctors...
                            </SelectItem>
                          ) : doctors.length === 0 ? (
                            <SelectItem value="no-doctors" disabled>
                              No doctors available
                            </SelectItem>
                          ) : (
                            doctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                <div>
                                  <p>{doctor.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {doctor.specialization || doctor.department}
                                  </p>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                      <Textarea
                        id="chiefComplaint"
                        value={appointmentData.chiefComplaint}
                        onChange={(e) =>
                          handleInputChange("chiefComplaint", e.target.value)
                        }
                        placeholder="Brief description of the reason for this appointment"
                        disabled={isReadOnly}
                      />
                    </div>

                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        value={appointmentData.roomNumber}
                        onChange={(e) =>
                          handleInputChange("roomNumber", e.target.value)
                        }
                        placeholder="Room 101"
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                            disabled={isReadOnly}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Select
                        value={appointmentData.appointmentTime}
                        onValueChange={(value) =>
                          handleInputChange("appointmentTime", value)
                        }
                        disabled={isReadOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select
                        value={appointmentData.durationMinutes.toString()}
                        onValueChange={(value) =>
                          handleInputChange("durationMinutes", parseInt(value))
                        }
                        disabled={isReadOnly}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((duration) => (
                            <SelectItem
                              key={duration.value}
                              value={duration.value.toString()}
                            >
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={appointmentData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Any additional notes or special instructions"
                      disabled={isReadOnly}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointment Summary & Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointmentData.patientId && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {(() => {
                            const patient = Array.isArray(patients)
                              ? patients.find(
                                  (p) => p.id === appointmentData.patientId
                                )
                              : null;
                            return patient
                              ? `${patient.firstName} ${patient.lastName}`
                              : "Unknown Patient";
                          })()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(patients)
                            ? patients.find(
                                (p) => p.id === appointmentData.patientId
                              )?.email
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {appointmentData.doctorId && (
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {Array.isArray(doctors)
                            ? doctors.find(
                                (d) => d.id === appointmentData.doctorId
                              )?.name
                            : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(doctors)
                            ? doctors.find(
                                (d) => d.id === appointmentData.doctorId
                              )?.specialization ||
                              doctors.find(
                                (d) => d.id === appointmentData.doctorId
                              )?.department
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedDate && appointmentData.appointmentTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointmentData.appointmentTime} (
                          {appointmentData.durationMinutes} minutes)
                        </p>
                      </div>
                    </div>
                  )}

                  {appointmentData.chiefComplaint && (
                    <div>
                      <p className="font-medium">Chief Complaint</p>
                      <p className="text-sm text-muted-foreground">
                        {appointmentData.chiefComplaint}
                      </p>
                    </div>
                  )}

                  {appointmentData.roomNumber && (
                    <div>
                      <p className="font-medium">Room</p>
                      <p className="text-sm text-muted-foreground">
                        {appointmentData.roomNumber}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {appointmentData.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {appointmentData.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {mode === "schedule" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Scheduling Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li>
                        • Patients will receive a confirmation email and SMS
                      </li>
                      <li>
                        • Reminder notifications will be sent 24 hours before
                      </li>
                      <li>
                        • Appointment can be rescheduled up to 2 hours before
                      </li>
                      <li>• Late cancellations may incur fees</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {!isReadOnly && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === "schedule" ? "Scheduling..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "schedule"
                    ? "Schedule Appointment"
                    : "Update Appointment"}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
