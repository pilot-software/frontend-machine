import {api} from '../api';

export interface ApiDepartment {
  id: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  location?: string;
  phone?: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export class DepartmentService {
  async getDepartments(): Promise<ApiDepartment[]> {
    return api.get('/departments');
  }

  async getDepartment(id: string): Promise<ApiDepartment> {
    return api.get(`/departments/${id}`);
  }
}

export const departmentService = new DepartmentService();
