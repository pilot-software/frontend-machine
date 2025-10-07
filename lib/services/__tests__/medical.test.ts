import { medicalService } from '../medical'
import { apiClient } from '../../api/client'

jest.mock('../../api/client')

describe('medicalService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getMedicalData fetches comprehensive medical data for patient', async () => {
    const mockMedicalData = {
      insurance: [{
        id: '1',
        provider: 'Blue Cross',
        policyNumber: 'BC123456'
      }],
      visits: [{
        id: '1',
        patientId: 'pat1',
        visitDate: '2024-01-01',
        diagnosis: 'Routine checkup'
      }],
      labResults: [{
        id: '1',
        organizationId: 'org1',
        patientId: 'pat1',
        testName: 'Blood Work',
        testDate: '2024-01-01',
        testResults: 'Normal',
        status: 'COMPLETED' as const,
        abnormalFlag: 'NORMAL' as const,
        createdAt: '2024-01-01T00:00:00Z'
      }],
      conditions: [{
        id: 1,
        patientId: 'pat1',
        conditionName: 'Hypertension',
        description: 'High blood pressure',
        severity: 'MODERATE' as const,
        diagnosedDate: '2024-01-01',
        status: 'ACTIVE' as const,
        notes: 'Monitor regularly',
        organizationId: 'org1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }],
      prescriptions: [{
        id: '1',
        organizationId: 'org1',
        patientId: 'pat1',
        doctorId: 'doc1',
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        refillsRemaining: 2,
        status: 'ACTIVE' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }],
      vitals: [{
        id: '1',
        organizationId: 'org1',
        patientId: 'pat1',
        recordedAt: '2024-01-01T10:00:00Z',
        temperature: 98.6,
        bloodPressure: '120/80',
        heartRate: 72,
        weight: 150,
        height: 68,
        oxygenSaturation: 98,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }]
    }
    ;(apiClient.get as jest.Mock).mockResolvedValue(mockMedicalData)

    const result = await medicalService.getMedicalData('pat1')
    expect(result).toEqual(mockMedicalData)
    expect(apiClient.get).toHaveBeenCalledWith('/medical/patients/pat1/medical-data')
  })

  it('handles empty medical data', async () => {
    const emptyData = {
      insurance: [],
      visits: [],
      labResults: [],
      conditions: [],
      prescriptions: [],
      vitals: []
    }
    ;(apiClient.get as jest.Mock).mockResolvedValue(emptyData)

    const result = await medicalService.getMedicalData('pat2')
    expect(result).toEqual(emptyData)
    expect(result.insurance).toHaveLength(0)
    expect(result.visits).toHaveLength(0)
  })
})
