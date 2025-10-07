import { labService } from '../lab'
import { api } from '../../api'

jest.mock('../../api')

describe('labService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getLabResults fetches all lab results', async () => {
    const mockResults = [{
      id: '1',
      patientId: 'pat1',
      testName: 'Blood Test',
      results: { glucose: 95, cholesterol: 180 },
      status: 'COMPLETED' as const,
      abnormalFlag: 'NORMAL' as const,
      orderedDate: '2024-01-01',
      orderedBy: 'doc1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockResults)

    const result = await labService.getLabResults()
    expect(result).toEqual(mockResults)
    expect(api.get).toHaveBeenCalledWith('/lab-results')
  })

  it('getLabResult fetches single lab result', async () => {
    const mockResult = {
      id: '1',
      patientId: 'pat1',
      testName: 'X-Ray',
      status: 'COMPLETED' as const,
      abnormalFlag: 'NORMAL' as const,
      orderedDate: '2024-01-01',
      orderedBy: 'doc1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    ;(api.get as jest.Mock).mockResolvedValue(mockResult)

    const result = await labService.getLabResult('1')
    expect(result).toEqual(mockResult)
    expect(api.get).toHaveBeenCalledWith('/lab-results/1')
  })

  it('createLabResult creates new lab result', async () => {
    const newResult = {
      patientId: 'pat1',
      testName: 'MRI',
      results: {},
      status: 'PENDING' as const,
      abnormalFlag: 'NORMAL' as const,
      orderedDate: '2024-01-01',
      orderedBy: 'doc1'
    }
    const createdResult = { id: '2', ...newResult, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
    ;(api.post as jest.Mock).mockResolvedValue(createdResult)

    const result = await labService.createLabResult(newResult)
    expect(result).toEqual(createdResult)
    expect(api.post).toHaveBeenCalledWith('/lab-results', newResult)
  })

  it('updateLabResult updates existing result', async () => {
    const updateData = { status: 'COMPLETED' as const, results: { value: 'normal' } }
    const updatedResult = { id: '1', ...updateData }
    ;(api.put as jest.Mock).mockResolvedValue(updatedResult)

    const result = await labService.updateLabResult('1', updateData)
    expect(result).toEqual(updatedResult)
    expect(api.put).toHaveBeenCalledWith('/lab-results/1', updateData)
  })

  it('getPatientLabResults fetches results for patient', async () => {
    const mockResults = [{ id: '1', patientId: 'pat1', testName: 'CBC' }]
    ;(api.get as jest.Mock).mockResolvedValue(mockResults)

    const result = await labService.getPatientLabResults('pat1')
    expect(result).toEqual(mockResults)
    expect(api.get).toHaveBeenCalledWith('/patients/pat1/lab-results')
  })

  it('deleteLabResult deletes lab result', async () => {
    ;(api.delete as jest.Mock).mockResolvedValue(undefined)

    await labService.deleteLabResult('1')
    expect(api.delete).toHaveBeenCalledWith('/lab-results/1')
  })
})
