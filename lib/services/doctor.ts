import { apiClient } from '../api';

export interface ApiDoctor {
    id: string;
    name: string;
    email: string;
    specialization: string;
    department: string;
    phone: string;
}

export const doctorService = {
    async getDoctors(): Promise<ApiDoctor[]> {
        const response = await apiClient.get('/users/role/doctor');
        return response.data;
    },

    async getDoctor(id: string): Promise<ApiDoctor> {
        const response = await apiClient.get(`/users/role/doctor/${id}`);
        return response.data;
    }
};