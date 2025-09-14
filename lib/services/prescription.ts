import { api } from '../api';

export interface ApiPrescriptionFull {
  id: string;
  patientId: string;
  doctorId: string;
  visitId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  refillsRemaining: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  prescribedDate: string;
  createdAt: string;
  updatedAt: string;
}

export class PrescriptionService {
  async getPrescriptions(): Promise<ApiPrescriptionFull[]> {
    return api.get('/prescriptions');
  }

  async getPrescription(id: string): Promise<ApiPrescriptionFull> {
    return api.get(`/prescriptions/${id}`);
  }

  async createPrescription(prescription: Omit<ApiPrescriptionFull, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiPrescriptionFull> {
    return api.post('/prescriptions', prescription);
  }

  async updatePrescription(id: string, prescription: Partial<ApiPrescriptionFull>): Promise<ApiPrescriptionFull> {
    return api.put(`/prescriptions/${id}`, prescription);
  }

  async getActivePrescriptions(): Promise<ApiPrescriptionFull[]> {
    return api.get('/prescriptions/active');
  }

  async getPatientPrescriptions(patientId: string): Promise<ApiPrescriptionFull[]> {
    return api.get(`/prescriptions/patient/${patientId}`);
  }

  async getDoctorPrescriptions(doctorId: string): Promise<ApiPrescriptionFull[]> {
    return api.get(`/prescriptions/doctor/${doctorId}`);
  }

  async updatePrescriptionStatus(id: string, status: string): Promise<ApiPrescriptionFull> {
    return api.put(`/prescriptions/${id}/status`, { status });
  }

  async deletePrescription(id: string): Promise<void> {
    return api.delete(`/prescriptions/${id}`);
  }
}

export const prescriptionService = new PrescriptionService();