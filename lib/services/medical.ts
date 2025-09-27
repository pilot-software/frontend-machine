import { apiClient } from '../api/client';

export interface MedicalData {
  insurance: any[];
  visits: any[];
  labResults: LabResult[];
  conditions: Condition[];
  prescriptions: Prescription[];
  vitals: Vital[];
}

export interface LabResult {
  id: string;
  organizationId: string;
  patientId: string;
  testName: string;
  testDate: string;
  testResults: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  abnormalFlag: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
  branchId?: string;
  createdAt: string;
}

export interface Condition {
  id: number;
  patientId: string;
  conditionName: string;
  description: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  diagnosedDate: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC' | 'IN_REMISSION';
  notes: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  organizationId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  refillsRemaining: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vital {
  id: string;
  organizationId: string;
  patientId: string;
  recordedAt: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  weight: number;
  height: number;
  oxygenSaturation: number;
  createdAt: string;
  updatedAt: string;
}

export class MedicalService {
  async getMedicalData(patientId: string): Promise<MedicalData> {
    return apiClient.get(`/medical/patients/${patientId}/medical-data`);
  }
}

export const medicalService = new MedicalService();