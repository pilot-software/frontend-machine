import { api } from '../api';

export interface DoctorAvailabilitySlot {
  id: string;
  organizationId: string;
  doctorId: string;
  doctorName?: string;
  branchId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'CANCELLED';
  patientId?: string;
  patientName?: string;
  appointmentId?: string;
  notes?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilitySlot {
  doctorId: string;
  branchId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  notes?: string;
}

export interface BookSlotRequest {
  slotId: string;
  patientId: string;
  appointmentId?: string;
  notes?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  date: string;
  slots: DoctorAvailabilitySlot[];
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export class DoctorAvailabilityService {
  async getDoctorAvailability(doctorId: string, date: string): Promise<DoctorAvailabilitySlot[]> {
    return api.get(`/api/doctor-availability/doctor/${doctorId}/available?date=${date}`);
  }

  async getDoctorAvailabilityRange(doctorId: string, startDate: string, endDate: string): Promise<DoctorAvailabilitySlot[]> {
    return api.get(`/api/doctor-availability/doctor/${doctorId}/range?startDate=${startDate}&endDate=${endDate}`);
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<DoctorAvailabilitySlot[]> {
    const slots = await this.getDoctorAvailability(doctorId, date);
    return slots.filter(slot => slot.status === 'AVAILABLE');
  }

  async getSlot(slotId: string): Promise<DoctorAvailabilitySlot> {
    return api.get(`/api/doctor-availability/slots/${slotId}`);
  }

  async createSlot(slot: CreateAvailabilitySlot): Promise<DoctorAvailabilitySlot> {
    return api.post('/api/doctor-availability/slots', slot);
  }

  async createMultipleSlots(
    doctorId: string,
    branchId: string,
    date: string,
    startTime: string,
    endTime: string,
    slotDuration: number = 30
  ): Promise<DoctorAvailabilitySlot[]> {
    const slots: CreateAvailabilitySlot[] = [];
    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    
    let current = start;
    while (current < end) {
      const slotStart = this.formatTime(current);
      current += slotDuration;
      const slotEnd = this.formatTime(Math.min(current, end));
      
      slots.push({
        doctorId,
        branchId,
        slotDate: date,
        startTime: slotStart,
        endTime: slotEnd,
        durationMinutes: slotDuration
      });
    }

    return Promise.all(slots.map(slot => this.createSlot(slot)));
  }

  async bookSlot(request: BookSlotRequest): Promise<DoctorAvailabilitySlot> {
    return api.post('/api/doctor-availability/slots/book', request);
  }

  async cancelSlot(slotId: string, reason?: string): Promise<DoctorAvailabilitySlot> {
    return api.put(`/api/doctor-availability/slots/${slotId}/cancel`, { reason });
  }

  async blockSlot(slotId: string, reason?: string): Promise<DoctorAvailabilitySlot> {
    return api.put(`/api/doctor-availability/slots/${slotId}/block`, { reason });
  }

  async unblockSlot(slotId: string): Promise<DoctorAvailabilitySlot> {
    return api.put(`/api/doctor-availability/slots/${slotId}/unblock`, {});
  }

  async releaseSlot(slotId: string): Promise<DoctorAvailabilitySlot> {
    return api.put(`/api/doctor-availability/slots/${slotId}/release`, {});
  }

  async getDoctorSchedule(doctorId: string, date: string): Promise<DoctorSchedule> {
    const slots = await this.getDoctorAvailability(doctorId, date);
    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => s.status === 'AVAILABLE').length;
    const bookedSlots = slots.filter(s => s.status === 'BOOKED').length;

    return {
      doctorId,
      doctorName: slots[0]?.doctorName || 'Unknown',
      date,
      slots,
      totalSlots,
      availableSlots,
      bookedSlots
    };
  }

  async getWeekSchedule(doctorId: string, startDate: string): Promise<DoctorSchedule[]> {
    const schedules: DoctorSchedule[] = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const schedule = await this.getDoctorSchedule(doctorId, dateStr);
      schedules.push(schedule);
    }
    
    return schedules;
  }

  async findNextAvailableSlot(doctorId: string, fromDate?: string): Promise<DoctorAvailabilitySlot | null> {
    const startDate = fromDate || new Date().toISOString().split('T')[0];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    
    const slots = await this.getDoctorAvailabilityRange(
      doctorId,
      startDate,
      endDate.toISOString().split('T')[0]
    );
    
    const available = slots.filter(s => s.status === 'AVAILABLE');
    return available.length > 0 ? available[0] : null;
  }

  async getAvailableDoctors(date: string, branchId?: string): Promise<{ doctorId: string; doctorName: string; availableSlots: number }[]> {
    // This would need a backend endpoint to get all doctors' availability
    // For now, returning empty array as placeholder
    return [];
  }

  groupSlotsByTime(slots: DoctorAvailabilitySlot[]): Map<string, DoctorAvailabilitySlot[]> {
    const grouped = new Map<string, DoctorAvailabilitySlot[]>();
    slots.forEach(slot => {
      const time = slot.startTime;
      if (!grouped.has(time)) {
        grouped.set(time, []);
      }
      grouped.get(time)!.push(slot);
    });
    return grouped;
  }

  isSlotInPast(slot: DoctorAvailabilitySlot): boolean {
    const slotDateTime = new Date(`${slot.slotDate}T${slot.startTime}`);
    return slotDateTime < new Date();
  }

  getSlotDuration(slot: DoctorAvailabilitySlot): number {
    if (slot.durationMinutes) return slot.durationMinutes;
    const start = this.parseTime(slot.startTime);
    const end = this.parseTime(slot.endTime);
    return end - start;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
  }
}

export const doctorAvailabilityService = new DoctorAvailabilityService();
