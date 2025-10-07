import { clinicalService } from '../clinical'
import { api } from '../../api'

jest.mock('../../api')

describe('clinicalService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getVisits fetches all visits', async () => {
    const mockVisits = [{
      id: '1',
      patientId: 'pat1',
      doctorId: 'doc1',
      visitDate: '2024-01-01',
      visitTime: '10:00',
      status: 'COMPLETED' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockVisits)

    const result = await clinicalService.getVisits()
    expect(result).toEqual(mockVisits)
    expect(api.get).toHaveBeenCalledWith('/visits')
  })

  it('getVisit fetches single visit', async () => {
    const mockVisit = {
      id: '1',
      patientId: 'pat1',
      doctorId: 'doc1',
      visitDate: '2024-01-01',
      visitTime: '10:00',
      status: 'COMPLETED' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    ;(api.get as jest.Mock).mockResolvedValue(mockVisit)

    const result = await clinicalService.getVisit('1')
    expect(result).toEqual(mockVisit)
    expect(api.get).toHaveBeenCalledWith('/visits/1')
  })

  it('createVisit creates new visit', async () => {
    const newVisit = {
      patientId: 'pat1',
      doctorId: 'doc1',
      visitDate: '2024-01-01',
      visitTime: '10:00',
      status: 'IN_PROGRESS' as const
    }
    const createdVisit = { id: '2', ...newVisit, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
    ;(api.post as jest.Mock).mockResolvedValue(createdVisit)

    const result = await clinicalService.createVisit(newVisit)
    expect(result).toEqual(createdVisit)
    expect(api.post).toHaveBeenCalledWith('/visits', newVisit)
  })

  it('updateVisit updates existing visit', async () => {
    const updateData = { status: 'COMPLETED' as const }
    const updatedVisit = { id: '1', status: 'COMPLETED' as const }
    ;(api.put as jest.Mock).mockResolvedValue(updatedVisit)

    const result = await clinicalService.updateVisit('1', updateData)
    expect(result).toEqual(updatedVisit)
    expect(api.put).toHaveBeenCalledWith('/visits/1', updateData)
  })

  it('getPatientVisits fetches visits for patient', async () => {
    const mockVisits = [{ id: '1', patientId: 'pat1' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockVisits)

    const result = await clinicalService.getPatientVisits('pat1')
    expect(result).toEqual(mockVisits)
    expect(api.get).toHaveBeenCalledWith('/patients/pat1/visits')
  })

  it('getVitalSigns fetches all vital signs', async () => {
    const mockVitals = [{
      id: '1',
      patientId: 'pat1',
      temperature: 98.6,
      bloodPressure: '120/80',
      heartRate: 72,
      recordedAt: '2024-01-01T10:00:00Z',
      recordedBy: 'nurse1'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockVitals)

    const result = await clinicalService.getVitalSigns()
    expect(result).toEqual(mockVitals)
    expect(api.get).toHaveBeenCalledWith('/vitals')
  })

  it('createVitalSigns creates new vital signs', async () => {
    const newVitals = {
      patientId: 'pat1',
      temperature: 99.1,
      heartRate: 80,
      recordedAt: '2024-01-01T10:00:00Z',
      recordedBy: 'nurse1'
    }
    const createdVitals = { id: '2', ...newVitals }
    ;(api.post as jest.Mock).mockResolvedValue(createdVitals)

    const result = await clinicalService.createVitalSigns(newVitals)
    expect(result).toEqual(createdVitals)
    expect(api.post).toHaveBeenCalledWith('/vitals', newVitals)
  })

  it('getPatientVitals fetches vitals for patient', async () => {
    const mockVitals = [{ id: '1', patientId: 'pat1' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockVitals)

    const result = await clinicalService.getPatientVitals('pat1')
    expect(result).toEqual(mockVitals)
    expect(api.get).toHaveBeenCalledWith('/patients/pat1/vitals')
  })
})
