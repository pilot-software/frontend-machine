import { prescriptionService } from '../prescription'
import { api } from '../../api'

jest.mock('../../api')

describe('prescriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getPrescriptions fetches all prescriptions', async () => {
    const mockPrescriptions = [{
      id: '1',
      patientId: 'pat1',
      doctorId: 'doc1',
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      refillsRemaining: 2,
      status: 'ACTIVE' as const,
      prescribedDate: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockPrescriptions)

    const result = await prescriptionService.getPrescriptions()
    expect(result).toEqual(mockPrescriptions)
    expect(api.get).toHaveBeenCalledWith('/prescriptions')
  })

  it('getPrescription fetches single prescription', async () => {
    const mockPrescription = {
      id: '1',
      patientId: 'pat1',
      doctorId: 'doc1',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      refillsRemaining: 3,
      status: 'ACTIVE' as const,
      prescribedDate: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    ;(api.get as jest.Mock).mockResolvedValue(mockPrescription)

    const result = await prescriptionService.getPrescription('1')
    expect(result).toEqual(mockPrescription)
    expect(api.get).toHaveBeenCalledWith('/prescriptions/1')
  })

  it('createPrescription creates new prescription', async () => {
    const newPrescription = {
      patientId: 'pat1',
      doctorId: 'doc1',
      medicationName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      refillsRemaining: 5,
      status: 'ACTIVE' as const,
      prescribedDate: '2024-01-01'
    }
    const createdPrescription = { id: '2', ...newPrescription, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
    ;(api.post as jest.Mock).mockResolvedValue(createdPrescription)

    const result = await prescriptionService.createPrescription(newPrescription)
    expect(result).toEqual(createdPrescription)
    expect(api.post).toHaveBeenCalledWith('/prescriptions', newPrescription)
  })

  it('getActivePrescriptions fetches active prescriptions', async () => {
    const mockActive = [{ id: '1', status: 'ACTIVE' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockActive)

    const result = await prescriptionService.getActivePrescriptions()
    expect(result).toEqual(mockActive)
    expect(api.get).toHaveBeenCalledWith('/prescriptions/active')
  })

  it('getPatientPrescriptions fetches prescriptions for patient', async () => {
    const mockPatientRx = [{ id: '1', patientId: 'pat1' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockPatientRx)

    const result = await prescriptionService.getPatientPrescriptions('pat1')
    expect(result).toEqual(mockPatientRx)
    expect(api.get).toHaveBeenCalledWith('/prescriptions/patient/pat1')
  })

  it('getDoctorPrescriptions fetches prescriptions by doctor', async () => {
    const mockDoctorRx = [{ id: '1', doctorId: 'doc1' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockDoctorRx)

    const result = await prescriptionService.getDoctorPrescriptions('doc1')
    expect(result).toEqual(mockDoctorRx)
    expect(api.get).toHaveBeenCalledWith('/prescriptions/doctor/doc1')
  })

  it('updatePrescriptionStatus updates prescription status', async () => {
    const updatedRx = { id: '1', status: 'COMPLETED' }
    ;(api.put as jest.Mock).mockResolvedValue(updatedRx)

    const result = await prescriptionService.updatePrescriptionStatus('1', 'COMPLETED')
    expect(result).toEqual(updatedRx)
    expect(api.put).toHaveBeenCalledWith('/prescriptions/1/status', { status: 'COMPLETED' })
  })

  it('deletePrescription deletes prescription', async () => {
    ;(api.delete as jest.Mock).mockResolvedValue(undefined)

    await prescriptionService.deletePrescription('1')
    expect(api.delete).toHaveBeenCalledWith('/prescriptions/1')
  })
})
