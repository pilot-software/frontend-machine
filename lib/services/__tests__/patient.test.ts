import { patientService } from '../patient'
import { apiClient } from '../../api'

jest.mock('../../api')

describe('patientService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getPatients fetches all patients', async () => {
    const mockPatients = [{ id: '1', firstName: 'John', lastName: 'Doe' }]
    ;(apiClient.getPatients as jest.Mock).mockResolvedValue(mockPatients)

    const result = await patientService.getPatients()
    expect(result).toEqual(mockPatients)
  })

  it('getPatientById fetches single patient', async () => {
    const mockPatients = [{ id: '1', firstName: 'John', lastName: 'Doe' }]
    ;(apiClient.getPatients as jest.Mock).mockResolvedValue(mockPatients)

    const result = await patientService.getPatientById('1')
    expect(result.id).toBe('1')
  })

  it('getPatientById throws error for non-existent patient', async () => {
    ;(apiClient.getPatients as jest.Mock).mockResolvedValue([])

    await expect(patientService.getPatientById('999')).rejects.toThrow('Patient with ID 999 not found')
  })

  it('createPatient adds new patient', async () => {
    const newPatient = { firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1990-01-01', gender: 'FEMALE' as const, country: 'US' }
    ;(apiClient.createPatient as jest.Mock).mockResolvedValue({ id: '2', ...newPatient })

    const result = await patientService.createPatient(newPatient)
    expect(result.firstName).toBe('Jane')
  })

  it('updatePatient modifies patient', async () => {
    const updated = { firstName: 'John Updated' }
    ;(apiClient.updatePatient as jest.Mock).mockResolvedValue({ id: '1', ...updated })

    const result = await patientService.updatePatient('1', updated)
    expect(result.firstName).toBe('John Updated')
  })
})
