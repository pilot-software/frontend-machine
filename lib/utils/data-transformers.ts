import { Patient, Doctor } from '../types';
import { calculateAge, safeDateToString } from './dateUtils';

export interface PatientDisplay {
  id: string;
  name: string;
  age: number;
  caseNumber: string;
  status: string;
  lastVisit: string;
  doctor: string;
  condition: string;
  department: string;
  avatar: string;
}

export interface AppointmentDisplay {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  department: string;
  reason: string;
  duration: number;
  notes?: string;
}

export const transformPatientToDisplay = (patient: Patient, doctors: Doctor[] = []): PatientDisplay => {
  const assignedDoctor = doctors.find(d => d.id === patient.assignedDoctorId);
  
  return {
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`,
    age: calculateAge(patient.dateOfBirth),
    caseNumber: patient.caseNumber || patient.id.substring(0, 8).toUpperCase(),
    status: patient.status || 'Active',
    lastVisit: safeDateToString(patient.updatedAt, new Date().toISOString().split('T')[0]),
    doctor: assignedDoctor?.name || 'Dr. Assigned',
    condition: patient.chronicConditions || 'General Care',
    department: patient.department || 'General',
    avatar: patient.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`
  };
};

export const transformAppointmentToDisplay = (appointment: any): AppointmentDisplay => ({
  id: appointment.id,
  patientName: appointment.patientName || 'Unknown Patient',
  doctorName: 'Doctor Name', // TODO: Get from user service
  date: appointment.appointmentDate,
  time: appointment.appointmentTime,
  type: 'routine',
  status: appointment.status.toLowerCase(),
  department: 'General',
  reason: appointment.chiefComplaint || 'General consultation',
  duration: appointment.durationMinutes,
  notes: appointment.notes
});