// Database-compatible types based on schema

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'finance';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type GenderType = 'male' | 'female' | 'other';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientStatus = 'active' | 'inactive' | 'deceased';

export type AppointmentType = 'routine' | 'urgent' | 'follow_up' | 'consultation' | 'surgery';
export type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type VisitType = 'routine' | 'urgent' | 'follow_up' | 'consultation' | 'surgery';
export type VisitStatus = 'in_progress' | 'completed' | 'cancelled';

export type ConditionSeverity = 'mild' | 'moderate' | 'severe' | 'critical';
export type ConditionStatus = 'active' | 'resolved' | 'chronic' | 'in_remission';

export type PrescriptionStatus = 'active' | 'completed' | 'cancelled' | 'expired';

export type TemperatureUnit = 'F' | 'C';
export type WeightUnit = 'lbs' | 'kg';

export type TestCategory = 'blood' | 'urine' | 'imaging' | 'pathology' | 'microbiology' | 'other';
export type ResultStatus = 'ordered' | 'in_progress' | 'completed' | 'cancelled';
export type AbnormalFlag = 'normal' | 'low' | 'high' | 'critical';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'written_off';
export type PaymentMethod = 'cash' | 'check' | 'credit_card' | 'insurance' | 'other';

export type InsuranceRelationship = 'self' | 'spouse' | 'child' | 'parent' | 'other';
export type InsuranceCoverage = 'primary' | 'secondary' | 'tertiary';
export type InsuranceStatus = 'active' | 'inactive' | 'expired';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    department?: string;
    specialization?: string;
    phone?: string;
    status: UserStatus;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
    assignedPatients?: string[];
}

export interface Patient {
    id: string;
    caseNumber?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth: string;
    gender: GenderType | string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContact?: string;
    emergencyContactRelationship?: string;
    bloodType?: BloodType;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    primaryDoctorId?: string;
    assignedDoctorId?: string;
    assignedDoctor?: string;
    department?: string;
    insurance?: string;
    insuranceProvider?: string;
    lastVisit?: string;
    avatar?: string;
    status: PatientStatus | string;
    createdAt: string;
    updatedAt: string;
    userId?: string;
}

export interface Doctor {
    id: string;
    organizationId?: string;
    email: string;
    passwordHash?: string;
    name: string;
    role: UserRole | string;
    department?: string;
    avatar?: string | null;
    specialization?: string;
    licenseNumber?: string | null;
    availability?: string | null;
    phone?: string;
    status: UserStatus | string;
    lastLogin?: string | null;
    createdAt: string;
    updatedAt: string;
    patients?: number;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentDate: string;
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
    createdAt: string;
    updatedAt: string;
}

export interface Visit {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    visitDate: string;
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
    createdAt: string;
    updatedAt: string;
}

export interface MedicalCondition {
    id: string;
    patientId: string;
    visitId?: string;
    conditionName: string;
    icd10Code?: string;
    diagnosisDate: string;
    severity: ConditionSeverity;
    status: ConditionStatus;
    notes?: string;
    diagnosedBy: string;
    createdAt: string;
    updatedAt: string;
}

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
    prescribedDate: string;
    startDate?: string;
    endDate?: string;
    pharmacyNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Vitals {
    id: string;
    patientId: string;
    visitId?: string;
    recordedBy: string;
    recordedAt: string;
    systolicBp?: number;
    diastolicBp?: number;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    temperatureUnit: TemperatureUnit;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit: WeightUnit;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
    bmi?: number;
    painScale?: number;
    notes?: string;
}

export interface LabResult {
    id: string;
    patientId: string;
    visitId?: string;
    orderedBy: string;
    testName: string;
    testCode?: string;
    testCategory: TestCategory;
    resultValue?: string;
    resultUnit?: string;
    referenceRange?: string;
    status: ResultStatus;
    abnormalFlag: AbnormalFlag;
    orderedDate: string;
    collectionDate?: string;
    resultDate?: string;
    labComments?: string;
    interpretation?: string;
}

export interface Billing {
    id: string;
    patientId: string;
    visitId?: string;
    appointmentId?: string;
    invoiceNumber: string;
    serviceDate: string;
    serviceDescription: string;
    procedureCodes?: string;
    diagnosisCodes?: string;
    amountCharged: number;
    amountPaid: number;
    amountDue?: number;
    paymentStatus: PaymentStatus;
    billingDate: string;
    dueDate: string;
    paymentDate?: string;
    paymentMethod?: PaymentMethod;
    notes?: string;
    createdBy: string;
}

export interface Insurance {
    id: string;
    patientId: string;
    insuranceCompany: string;
    policyNumber: string;
    groupNumber?: string;
    policyHolderName: string;
    relationshipToPatient: InsuranceRelationship;
    coverageType: InsuranceCoverage;
    effectiveDate: string;
    expirationDate?: string;
    copayAmount?: number;
    deductibleAmount?: number;
    deductibleMet: number;
    status: InsuranceStatus;
    preAuthRequired: boolean;
    notes?: string;
}

export interface SecurityLog {
    id: string;
    userId?: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
    success: boolean;
    failureReason?: string;
    additionalData?: string;
}

export interface UserSession {
    id: string;
    userId: string;
    sessionToken: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    expiresAt: string;
    lastActivity: string;
    isActive: boolean;
}