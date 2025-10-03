import {api} from '../api';

export interface ApiVisit {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  visitTime: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface ApiVitalSigns {
  id: string;
  patientId: string;
  visitId?: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  recordedAt: string;
  recordedBy: string;
}

export class ClinicalService {
  async getVisits(): Promise<ApiVisit[]> {
    return api.get('/visits');
  }

  async getVisit(id: string): Promise<ApiVisit> {
    return api.get(`/visits/${id}`);
  }

  async createVisit(visit: Omit<ApiVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiVisit> {
    return api.post('/visits', visit);
  }

  async updateVisit(id: string, visit: Partial<ApiVisit>): Promise<ApiVisit> {
    return api.put(`/visits/${id}`, visit);
  }

  async getPatientVisits(patientId: string): Promise<ApiVisit[]> {
    return api.get(`/patients/${patientId}/visits`);
  }

  async getVitalSigns(): Promise<ApiVitalSigns[]> {
    return api.get('/vitals');
  }

  async createVitalSigns(vitals: Omit<ApiVitalSigns, 'id'>): Promise<ApiVitalSigns> {
    return api.post('/vitals', vitals);
  }

  async getPatientVitals(patientId: string): Promise<ApiVitalSigns[]> {
    return api.get(`/patients/${patientId}/vitals`);
  }
}

export const clinicalService = new ClinicalService();
