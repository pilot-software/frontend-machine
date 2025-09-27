import { apiClient } from '../api';

export interface ApiPatient {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
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
  bloodType?: "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE";
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPrescription {
  id: string;
  organizationId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  refillsRemaining: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface ApiLabResult {
  id: string;
  organizationId: string;
  patientId: string;
  testName: string;
  testDate: string;
  results: Record<string, any>;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  abnormalFlag: "NORMAL" | "ABNORMAL" | "CRITICAL";
  createdAt: string;
  updatedAt: string;
}

export type CreatePatient = Omit<ApiPatient, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type UpdatePatient = Partial<ApiPatient>;

export class PatientService {
  async getPatients(): Promise<ApiPatient[]> {
    return apiClient.getPatients();
  }

  async getPatientById(id: string): Promise<ApiPatient> {
    const patients = await this.getPatients();
    const patient = patients.find(p => p.id === id);
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async createPatient(patient: CreatePatient): Promise<ApiPatient> {
    return apiClient.createPatient(patient);
  }

  async updatePatient(id: string, patient: Partial<CreatePatient>): Promise<ApiPatient> {
    return apiClient.updatePatient(id, patient);
  }
}

export const patientService = new PatientService();