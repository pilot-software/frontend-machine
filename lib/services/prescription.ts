import {api} from '../api';

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
        return api.get('/api/prescriptions');
    }

    async getPrescription(id: string): Promise<ApiPrescriptionFull> {
        return api.get(`/api/prescriptions/${id}`);
    }

    async createPrescription(prescription: Omit<ApiPrescriptionFull, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiPrescriptionFull> {
        return api.post('/api/prescriptions', prescription);
    }

    async updatePrescription(id: string, prescription: Partial<ApiPrescriptionFull>): Promise<ApiPrescriptionFull> {
        return api.put(`/api/prescriptions/${id}`, prescription);
    }

    async getActivePrescriptions(): Promise<ApiPrescriptionFull[]> {
        return api.get('/api/prescriptions/active');
    }

    async getPatientPrescriptions(patientId: string): Promise<ApiPrescriptionFull[]> {
        return api.get(`/api/prescriptions/patient/${patientId}`);
    }

    async getDoctorPrescriptions(doctorId: string): Promise<ApiPrescriptionFull[]> {
        return api.get(`/api/prescriptions/doctor/${doctorId}`);
    }

    async updatePrescriptionStatus(id: string, status: string): Promise<ApiPrescriptionFull> {
        return api.put(`/api/prescriptions/${id}/status`, {status});
    }

    async deletePrescription(id: string): Promise<void> {
        return api.delete(`/api/prescriptions/${id}`);
    }
}

export const prescriptionService = new PrescriptionService();
