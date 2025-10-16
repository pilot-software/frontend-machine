'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Save } from 'lucide-react';
import { appointmentService } from '@/lib/services/appointment';
import { useAuth } from '@/components/providers/AuthContext';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchDoctors, fetchPatients } from '@/lib/store/slices/appSlice';
import { ROLES } from '@/lib/constants';
import { cn } from '@/components/ui/utils';
import { format } from 'date-fns';

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

export default function AddAppointmentPage() {
  const t = useTranslations('common');
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { patients, doctors, loading } = useAppSelector((state) => state.app);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [appointmentData, setAppointmentData] = useState<AppointmentFormData>({
    patientId: '',
    doctorId: user?.role === ROLES.DOCTOR ? user.id : '',
    appointmentDate: '',
    appointmentTime: '',
    durationMinutes: 30,
    chiefComplaint: '',
    notes: '',
    roomNumber: '',
  });

  React.useEffect(() => {
    if (patients.length === 0) dispatch(fetchPatients());
    if (doctors.length === 0) dispatch(fetchDoctors());
  }, [dispatch, patients.length, doctors.length]);

  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

  const handleInputChange = (field: keyof AppointmentFormData, value: string | number) => {
    setAppointmentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setAppointmentData((prev) => ({ ...prev, appointmentDate: `${year}-${month}-${day}` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
        alert('Please fill in all required fields (Patient, Doctor, Date, Time)');
        return;
      }

      const apiData = {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        durationMinutes: appointmentData.durationMinutes || 30,
        status: 'SCHEDULED' as const,
        chiefComplaint: appointmentData.chiefComplaint || undefined,
        notes: appointmentData.notes || undefined,
        roomNumber: appointmentData.roomNumber || undefined,
        createdBy: user?.id || 'system',
      };

      await appointmentService.createAppointment(apiData);
      router.push('/en/appointments');
    } catch (error) {
      console.error('Failed to save appointment:', error);
      alert(`Failed to save appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Schedule New Appointment</h2>
          <p className="text-muted-foreground mt-1">Create a new appointment for a patient</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} className="flex-1 sm:flex-none">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Schedule Appointment
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Information</CardTitle>
                <CardDescription>Basic appointment details and scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient *</Label>
                <Select value={appointmentData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={loading.patients ? 'Loading patients...' : 'Select patient'} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="doctor">Doctor *</Label>
                <Select value={appointmentData.doctorId} onValueChange={(value) => handleInputChange('doctorId', value)} disabled={user?.role === ROLES.DOCTOR}>
                  <SelectTrigger>
                    <SelectValue placeholder={loading.doctors ? 'Loading doctors...' : 'Select doctor'} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization || doctor.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={(date) => date < new Date()} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Select value={appointmentData.appointmentTime} onValueChange={(value) => handleInputChange('appointmentTime', value)}>
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
                <Select value={appointmentData.durationMinutes.toString()} onValueChange={(value) => handleInputChange('durationMinutes', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Textarea
                  id="chiefComplaint"
                  value={appointmentData.chiefComplaint}
                  onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  placeholder="Brief description of the reason for this appointment"
                />
              </div>

              <div>
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={appointmentData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  placeholder="Room 101"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={appointmentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes or special instructions"
              />
            </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointmentData.patientId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">
                      {patients.find((p) => p.id === appointmentData.patientId)?.firstName} {patients.find((p) => p.id === appointmentData.patientId)?.lastName}
                    </p>
                  </div>
                )}

                {appointmentData.doctorId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{doctors.find((d) => d.id === appointmentData.doctorId)?.name}</p>
                  </div>
                )}

                {selectedDate && appointmentData.appointmentTime && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm">{appointmentData.appointmentTime} ({appointmentData.durationMinutes} minutes)</p>
                  </div>
                )}

                {appointmentData.chiefComplaint && (
                  <div>
                    <p className="text-sm text-muted-foreground">Chief Complaint</p>
                    <p className="text-sm">{appointmentData.chiefComplaint}</p>
                  </div>
                )}

                {appointmentData.roomNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="text-sm">{appointmentData.roomNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Scheduling Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Patients will receive a confirmation email and SMS</li>
                  <li>• Reminder notifications will be sent 24 hours before</li>
                  <li>• Appointment can be rescheduled up to 2 hours before</li>
                  <li>• Late cancellations may incur fees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>


      </form>
    </div>
  );
}
