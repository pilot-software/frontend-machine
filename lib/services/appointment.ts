

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
    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.statusText}`);
    }
    return response.json();
  }

  async getAppointmentsWithPatientNames(): Promise<(ApiAppointment & { patientName: string })[]> {
    const response = await fetch('https://springboot-api.azurewebsites.net/api/appointments/with-patient-names', {
      headers: this.getHeaders()
    });
    if (!response.ok) {
      // Fallback to regular appointments if endpoint doesn't exist
      return this.getAppointments().then(appointments => 
        appointments.map(apt => ({ ...apt, patientName: 'Unknown Patient' }))
      );
    }
    return response.json();
  }

  async createAppointment(appointment: CreateAppointment): Promise<ApiAppointment> {
    // Validate date format before sending
    const payload = {
      ...appointment,
      appointmentDate: this.formatDate(appointment.appointmentDate),
      appointmentTime: this.formatTime(appointment.appointmentTime)
    };

    const response = await fetch('https://springboot-api.azurewebsites.net/api/appointments', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create appointment: ${errorText}`);
    }
    return response.json();
  }

  async updateAppointment(id: string, appointment: UpdateAppointment): Promise<ApiAppointment> {
    // Validate date format before sending
    const payload = {
      ...appointment,
      ...(appointment.appointmentDate && { appointmentDate: this.formatDate(appointment.appointmentDate) }),
      ...(appointment.appointmentTime && { appointmentTime: this.formatTime(appointment.appointmentTime) })
    };

    const response = await fetch(`https://springboot-api.azurewebsites.net/api/appointments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update appointment: ${errorText}`);
    }
    return response.json();
  }

  private formatDate(dateInput: string): string {
    try {
      // Handle various date formats
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      // Return YYYY-MM-DD format
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Date formatting error:', error);
      throw new Error('Invalid date format');
    }
  }

  private formatTime(timeInput: string): string {
    try {
      // Ensure time is in HH:MM format
      if (!/^\d{2}:\d{2}$/.test(timeInput)) {
        throw new Error('Invalid time format');
      }
      return timeInput;
    } catch (error) {
      console.error('Time formatting error:', error);
      throw new Error('Invalid time format');
    }
  }
}

export const appointmentService = new AppointmentService();