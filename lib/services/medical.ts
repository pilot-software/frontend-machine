import {api} from '../api';

export interface LabOrder {
    patientId: string;
    doctorId: string;
    testType: string;
    instructions?: string;
    urgency: 'ROUTINE' | 'URGENT' | 'STAT';
}

export interface FileUpload {
    patientId: string;
    description: string;
}

export class MedicalService {
    async createLabOrder(order: LabOrder): Promise<any> {
        return api.post('/api/medical/lab-orders', order);
    }

    async uploadFile(file: File, data: FileUpload): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', data.patientId);
        formData.append('description', data.description);
        
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/files/upload`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        return response.json();
    }
}

export const medicalService = new MedicalService();
