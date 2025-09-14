# Healthcare Management System - Data Models

## Overview

This document defines the TypeScript interfaces and data models used throughout the Healthcare Management System,
ensuring consistent data structures across all components.

## Core Data Models

### User and Authentication Models

```typescript
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'finance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
}

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  isActive: boolean;
}
```

### Patient Models

```typescript
export interface Patient {
  id: string;
  userId?: string; // Link to user account for patient portal
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  primaryDoctorId?: string;
  status: 'active' | 'inactive' | 'deceased';
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit?: Date;
  nextAppointment?: Date;
  primaryDoctor?: string;
  status: string;
}
```

### Appointment Models

```typescript
export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'surgery' | 'diagnostic';
export type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
  durationMinutes: number;
  appointmentType: AppointmentType;
  priority: AppointmentPriority;
  status: AppointmentStatus;
  chiefComplaint?: string;
  notes?: string;
  roomNumber?: string;
  createdBy: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentWithDetails extends Appointment {
  patientName: string;
  doctorName: string;
  patientAge: number;
}
```

### Clinical Models

```typescript
export type VisitType = 'routine' | 'emergency' | 'follow_up' | 'consultation' | 'surgery';
export type VisitStatus = 'in_progress' | 'completed' | 'cancelled';

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  visitDate: Date;
  visitTime: string;
  visitType: VisitType;
  chiefComplaint?: string;
  historyPresentIllness?: string;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
  dischargeInstructions?: string;
  followUpInstructions?: string;
  status: VisitStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalCondition {
  id: string;
  patientId: string;
  visitId?: string;
  conditionName: string;
  icd10Code?: string;
  diagnosisDate: Date;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'resolved' | 'chronic' | 'in_remission';
  notes?: string;
  diagnosedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vitals {
  id: string;
  patientId: string;
  visitId?: string;
  recordedBy: string;
  recordedAt: Date;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  temperatureUnit: 'F' | 'C';
  oxygenSaturation?: number;
  weight?: number;
  weightUnit: 'lbs' | 'kg';
  heightFeet?: number;
  heightInches?: number;
  heightCm?: number;
  bmi?: number;
  painScale?: number; // 0-10
  notes?: string;
}
```

### Prescription Models

```typescript
export type PrescriptionStatus = 'active' | 'completed' | 'cancelled' | 'expired';

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  visitId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  quantityPrescribed?: number;
  refillsRemaining: number;
  instructions?: string;
  indication?: string;
  status: PrescriptionStatus;
  prescribedDate: Date;
  startDate?: Date;
  endDate?: Date;
  pharmacyNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionWithDetails extends Prescription {
  patientName: string;
  doctorName: string;
}
```

### Laboratory Models

```typescript
export type LabTestCategory = 'blood' | 'urine' | 'imaging' | 'pathology' | 'microbiology' | 'other';
export type LabStatus = 'ordered' | 'in_progress' | 'completed' | 'cancelled';
export type AbnormalFlag = 'normal' | 'low' | 'high' | 'critical';

export interface LabResult {
  id: string;
  patientId: string;
  visitId?: string;
  orderedBy: string;
  testName: string;
  testCode?: string;
  testCategory: LabTestCategory;
  resultValue?: string;
  resultUnit?: string;
  referenceRange?: string;
  status: LabStatus;
  abnormalFlag: AbnormalFlag;
  orderedDate: Date;
  collectionDate?: Date;
  resultDate?: Date;
  labComments?: string;
  interpretation?: string;
}
```

### Financial Models

```typescript
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off';
export type PaymentMethod = 'cash' | 'check' | 'credit_card' | 'insurance' | 'other';

export interface Billing {
  id: string;
  patientId: string;
  visitId?: string;
  appointmentId?: string;
  invoiceNumber: string;
  serviceDate: Date;
  serviceDescription: string;
  procedureCodes?: string; // CPT codes
  diagnosisCodes?: string; // ICD-10 codes
  amountCharged: number;
  amountPaid: number;
  amountDue: number; // Computed field
  paymentStatus: PaymentStatus;
  billingDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdBy: string;
}

export type CoverageType = 'primary' | 'secondary' | 'tertiary';
export type RelationshipToPatient = 'self' | 'spouse' | 'child' | 'parent' | 'other';

export interface Insurance {
  id: string;
  patientId: string;
  insuranceCompany: string;
  policyNumber: string;
  groupNumber?: string;
  policyHolderName: string;
  relationshipToPatient: RelationshipToPatient;
  coverageType: CoverageType;
  effectiveDate: Date;
  expirationDate?: Date;
  copayAmount?: number;
  deductibleAmount?: number;
  deductibleMet: number;
  status: 'active' | 'inactive' | 'expired';
  preAuthRequired: boolean;
  notes?: string;
}
```

### Security and Audit Models

```typescript
export interface SecurityLog {
  id: string;
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  failureReason?: string;
  additionalData?: Record<string, any>;
}

export interface AuditTrail {
  id: string;
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  userId: string;
  timestamp: Date;
}
```

### Dashboard and Analytics Models

```typescript
export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingBilling: number;
  criticalAlerts: number;
  activeUsers: number;
}

export interface AppointmentMetrics {
  totalScheduled: number;
  completed: number;
  cancelled: number;
  noShows: number;
  completionRate: number;
}

export interface PatientMetrics {
  newPatients: number;
  activePatients: number;
  averageAge: number;
  genderDistribution: Record<string, number>;
}

export interface FinancialMetrics {
  totalRevenue: number;
  collectedAmount: number;
  pendingAmount: number;
  collectionRate: number;
}
```

### Form and Modal Models

```typescript
export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  priority: AppointmentPriority;
  chiefComplaint: string;
  notes: string;
}

export interface VitalsFormData {
  systolicBp: string;
  diastolicBp: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  temperatureUnit: 'F' | 'C';
  oxygenSaturation: string;
  weight: string;
  weightUnit: 'lbs' | 'kg';
  heightFeet: string;
  heightInches: string;
  painScale: string;
  notes: string;
}
```

### API Response Models

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  department?: string;
  doctorId?: string;
  patientId?: string;
}
```

## Utility Types

```typescript
// Omit password and sensitive fields for API responses
export type SafeUser = Omit<User, 'password'>;

// Partial update types for forms
export type PatientUpdate = Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>;
export type AppointmentUpdate = Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>;

// ID-only references for dropdowns
export interface SelectOption {
  value: string;
  label: string;
}

// Table column definitions
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Modal states
export type ModalMode = 'create' | 'edit' | 'view';

export interface ModalState<T> {
  isOpen: boolean;
  mode: ModalMode;
  data?: T;
}
```

## Validation Schemas

```typescript
// Zod schemas for form validation
export const PatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    return birthDate < new Date();
  }, 'Birth date must be in the past'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  // ... additional validation rules
});

export const AppointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  appointmentDate: z.string().refine((date) => {
    const appointmentDate = new Date(date);
    return appointmentDate >= new Date();
  }, 'Appointment date cannot be in the past'),
  appointmentTime: z.string().min(1, 'Time is required'),
  appointmentType: z.enum(['consultation', 'follow_up', 'emergency', 'surgery', 'diagnostic']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  // ... additional validation rules
});
```

## Constants and Enums

```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient',
  FINANCE: 'finance'
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  SURGERY: 'surgery',
  DIAGNOSTIC: 'diagnostic'
} as const;

export const VITAL_RANGES = {
  SYSTOLIC_BP: { min: 70, max: 250 },
  DIASTOLIC_BP: { min: 40, max: 150 },
  HEART_RATE: { min: 30, max: 250 },
  RESPIRATORY_RATE: { min: 8, max: 60 },
  TEMPERATURE_F: { min: 95, max: 110 },
  OXYGEN_SATURATION: { min: 70, max: 100 },
  PAIN_SCALE: { min: 0, max: 10 }
} as const;
```

This comprehensive data model documentation ensures consistent typing throughout the Healthcare Management System and
provides clear interfaces for all healthcare-related data structures.
