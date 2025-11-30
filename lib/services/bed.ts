import { BaseEntity, IBaseService } from '../abstractions/service.interface';
import { api } from '../api';

export interface ApiBed {
  id: string;
  bedNumber: string;
  ward: string;
  floor: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  patientId: string | null;
  patientName: string | null;
  condition: string | null;
  lastCleaned: string;
}

export type CreateBed = Omit<ApiBed, 'id' | 'patientId' | 'patientName' | 'condition' | 'lastCleaned'> & {
  branchId: string;
};
export type UpdateBed = Partial<CreateBed>;

export class BedService {
  async getAll(): Promise<ApiBed[]> {
    return api.get('/api/admin/bed-management/beds/branch/branch_main');
  }

  async getById(id: string): Promise<ApiBed> {
    return api.get(`/api/admin/bed-management/beds/${id}`);
  }

  async create(bed: CreateBed): Promise<ApiBed> {
    return api.post('/api/admin/bed-management/beds', bed);
  }

  async update(id: string, bed: UpdateBed): Promise<ApiBed> {
    return api.put(`/api/admin/bed-management/beds/${id}`, bed);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/api/admin/bed-management/beds/${id}`);
  }
}

export const bedService = new BedService();
