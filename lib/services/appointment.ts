import {BaseEntity, IBaseService} from '../abstractions/service.interface';
import {apiClient} from '../api';

export interface ApiAppointment extends BaseEntity {
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
}

export type CreateAppointment = Omit<ApiAppointment, keyof BaseEntity | 'organizationId'>;
export type UpdateAppointment = Partial<ApiAppointment>;

export class AppointmentService implements IBaseService<ApiAppointment, CreateAppointment, UpdateAppointment> {
    async getAll(): Promise<ApiAppointment[]> {
        return apiClient.getAppointments();
    }

    async getById(id: string): Promise<ApiAppointment> {
        const {api} = await import('../api');
        return api.get(`/api/appointments/${id}`);
    }

    async create(appointment: CreateAppointment): Promise<ApiAppointment> {
        const payload = this.formatAppointmentData(appointment);
        return apiClient.createAppointment(payload);
    }

    async update(id: string, appointment: UpdateAppointment): Promise<ApiAppointment> {
        const payload = this.formatAppointmentData(appointment);
        const {api} = await import('../api');
        return api.put(`/api/appointments/${id}`, payload);
    }

    // Legacy methods for backward compatibility
    async createAppointment(appointment: CreateAppointment): Promise<ApiAppointment> {
        return this.create(appointment);
    }

    async updateAppointment(id: string, appointment: UpdateAppointment): Promise<ApiAppointment> {
        return this.update(id, appointment);
    }

    async delete(id: string): Promise<void> {
        const {api} = await import('../api');
        return api.delete(`/api/appointments/${id}`);
    }

    async getAppointmentsWithPatientNames(): Promise<(ApiAppointment & { patientName: string })[]> {
        const [appointments, patients] = await Promise.all([
            this.getAll(),
            apiClient.getPatients()
        ]);

        return appointments.map(apt => {
            const patient = (patients as any[]).find((p: any) => p.id === apt.patientId);
            return {
                ...apt,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
            };
        });
    }

    async getTodayAppointments(): Promise<ApiAppointment[]> {
        const {api} = await import('../api');
        return api.get('/api/appointments/today');
    }

    private formatAppointmentData(appointment: Partial<ApiAppointment>) {
        return {
            ...appointment,
            ...(appointment.appointmentDate && {appointmentDate: this.formatDate(appointment.appointmentDate)}),
            ...(appointment.appointmentTime && {appointmentTime: this.formatTime(appointment.appointmentTime)})
        };
    }

    private formatDate(dateInput: string): string {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) throw new Error('Invalid date format');
        return date.toISOString().split('T')[0];
    }

    private formatTime(timeInput: string): string {
        if (!/^\d{2}:\d{2}$/.test(timeInput)) throw new Error('Invalid time format');
        return timeInput;
    }
}

export const appointmentService = new AppointmentService();
