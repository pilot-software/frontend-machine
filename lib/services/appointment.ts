

export interface ApiAppointment {
  id: string;
  organizationId: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  chiefComplaint?: string;
  notes?: string;
  roomNumber?: string;
  createdBy: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAppointment = Omit<ApiAppointment, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type UpdateAppointment = Partial<ApiAppointment>;

export class AppointmentService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAppointments(): Promise<ApiAppointment[]> {
    const response = await fetch('https://springboot-api.azurewebsites.net/api/appointments', {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async createAppointment(appointment: CreateAppointment): Promise<ApiAppointment> {
    const response = await fetch('https://springboot-api.azurewebsites.net/api/appointments', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(appointment)
    });
    return response.json();
  }
}

export const appointmentService = new AppointmentService();