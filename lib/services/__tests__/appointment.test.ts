import { appointmentService } from '../appointment'
import { apiClient } from '../../api'

jest.mock('../../api')

describe('appointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAll fetches appointments', async () => {
    const mockAppointments = [{ id: '1', patientId: '1', appointmentDate: '2024-01-01' }]
    ;(apiClient.getAppointments as jest.Mock).mockResolvedValue(mockAppointments)

    const result = await appointmentService.getAll()
    expect(result).toEqual(mockAppointments)
  })

  it('create adds new appointment', async () => {
    const newAppt = { patientId: '1', doctorId: '1', appointmentDate: '2024-01-01', appointmentTime: '10:00', durationMinutes: 30, status: 'SCHEDULED' as const, createdBy: '1' }
    ;(apiClient.createAppointment as jest.Mock).mockResolvedValue({ id: '2', ...newAppt })

    const result = await appointmentService.create(newAppt)
    expect(result.patientId).toBe('1')
  })

  it('getAppointmentsWithPatientNames combines data', async () => {
    const mockAppointments = [{ id: '1', patientId: '1', appointmentDate: '2024-01-01' }]
    const mockPatients = [{ id: '1', firstName: 'John', lastName: 'Doe' }]
    ;(apiClient.getAppointments as jest.Mock).mockResolvedValue(mockAppointments)
    ;(apiClient.getPatients as jest.Mock).mockResolvedValue(mockPatients)

    const result = await appointmentService.getAppointmentsWithPatientNames()
    expect(result[0].patientName).toBe('John Doe')
  })

  it('handles unknown patient in getAppointmentsWithPatientNames', async () => {
    const mockAppointments = [{ id: '1', patientId: '999', appointmentDate: '2024-01-01' }]
    ;(apiClient.getAppointments as jest.Mock).mockResolvedValue(mockAppointments)
    ;(apiClient.getPatients as jest.Mock).mockResolvedValue([])

    const result = await appointmentService.getAppointmentsWithPatientNames()
    expect(result[0].patientName).toBe('Unknown Patient')
  })

  it('createAppointment formats date and time', async () => {
    const newAppt = { 
      patientId: '1', 
      doctorId: '1', 
      appointmentDate: '2024-01-15T10:00:00', 
      appointmentTime: '14:30',
      durationMinutes: 30,
      status: 'SCHEDULED' as const,
      createdBy: '1'
    }
    ;(apiClient.createAppointment as jest.Mock).mockResolvedValue({ id: '2', ...newAppt })

    const result = await appointmentService.create(newAppt)
    expect(result.patientId).toBe('1')
  })
})
