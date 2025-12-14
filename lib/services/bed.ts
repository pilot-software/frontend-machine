import { api } from "../api";

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

export interface Room {
  id: string;
  roomNumber: string;
  wardId: string;
  roomType: string;
  capacity: number;
  floor: string;
  branchId: string;
}

export interface Ward {
  id: string;
  name: string;
  branchId: string;
  capacity: number;
  wardType: string;
}

export type CreateBed = {
  bedNumber: string;
  roomId: string;
  bedType: "STANDARD" | "ICU" | "PRIVATE" | "ISOLATION";
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  branchId: string;
};

export type CreateRoom = {
  roomNumber: string;
  wardId: string;
  roomType: string;
  capacity: number;
  floor: string;
  branchId: string;
};

export type CreateWard = {
  name: string;
  branchId: string;
  capacity: number;
  wardType: string;
};

export type UpdateBed = Partial<CreateBed>;

export class BedService {
  async getAll(): Promise<ApiBed[]> {
    return api.get("/api/admin/bed-management/beds/branch/branch_main");
  }

  async getById(id: string): Promise<ApiBed> {
    return api.get(`/api/admin/bed-management/beds/${id}`);
  }

  async getRooms(): Promise<Room[]> {
    return api.get("/api/admin/bed-management/rooms/branch/branch_main");
  }

  async getWards(): Promise<Ward[]> {
    return api.get("/api/admin/bed-management/wards/branch/branch_main");
  }

  async create(bed: CreateBed): Promise<ApiBed> {
    return api.post("/api/admin/bed-management/beds", bed);
  }

  async createRoom(room: CreateRoom): Promise<Room> {
    return api.post("/api/admin/bed-management/rooms", room);
  }

  async createWard(ward: CreateWard): Promise<Ward> {
    return api.post("/api/admin/bed-management/wards", ward);
  }

  async update(id: string, bed: UpdateBed): Promise<ApiBed> {
    return api.put(`/api/admin/bed-management/beds/${id}`, bed);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/api/admin/bed-management/beds/${id}`);
  }
}

export const bedService = new BedService();
