import {api} from '../api';

export interface ApiLabResult {
    id: string;
    patientId: string;
    visitId?: string;
    testName: string;
    testCode?: string;
    results: Record<string, any>;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    abnormalFlag: "NORMAL" | "ABNORMAL" | "CRITICAL";
    orderedDate: string;
    resultDate?: string;
    orderedBy: string;
    createdAt: string;
    updatedAt: string;
}

export class LabService {
    async getLabResults(): Promise<ApiLabResult[]> {
        return api.get('/api/lab-results');
    }

    async getLabResult(id: string): Promise<ApiLabResult> {
        return api.get(`/api/lab-results/${id}`);
    }

    async createLabResult(labResult: Omit<ApiLabResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiLabResult> {
        return api.post('/api/lab-results', labResult);
    }

    async updateLabResult(id: string, labResult: Partial<ApiLabResult>): Promise<ApiLabResult> {
        return api.put(`/api/lab-results/${id}`, labResult);
    }

    async getPatientLabResults(patientId: string): Promise<ApiLabResult[]> {
        return api.get(`/api/patients/${patientId}/lab-results`);
    }

    async deleteLabResult(id: string): Promise<void> {
        return api.delete(`/api/lab-results/${id}`);
    }
}

export const labService = new LabService();
