import {apiClient} from '../api/client';

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
        return await apiClient.get<ApiDoctor[]>('/users/doctors');
    },

    async getDoctor(id: string): Promise<ApiDoctor> {
        return await apiClient.get<ApiDoctor>(`/users/doctors/${id}`);
    }
};
