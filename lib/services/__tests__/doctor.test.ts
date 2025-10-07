import { doctorService } from '../doctor'
import { apiClient } from '../../api/client'

jest.mock('../../api/client')

describe('doctorService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDoctors fetches all doctors', async () => {
    const mockDoctors = [{
      id: '1',
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      specialization: 'Cardiology',
      department: 'Cardiology',
      phone: '555-0101'
    }, {
      id: '2',
      name: 'Dr. Johnson',
      email: 'dr.johnson@hospital.com',
      specialization: 'Neurology',
      department: 'Neurology',
      phone: '555-0102'
    }]
    ;(apiClient.get as jest.Mock).mockResolvedValue(mockDoctors)

    const result = await doctorService.getDoctors()
    expect(result).toEqual(mockDoctors)
    expect(apiClient.get).toHaveBeenCalledWith('/users/doctors')
  })

  it('getDoctor fetches single doctor', async () => {
    const mockDoctor = {
      id: '1',
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      specialization: 'Cardiology',
      department: 'Cardiology',
      phone: '555-0101'
    }
    ;(apiClient.get as jest.Mock).mockResolvedValue(mockDoctor)

    const result = await doctorService.getDoctor('1')
    expect(result).toEqual(mockDoctor)
    expect(apiClient.get).toHaveBeenCalledWith('/users/doctors/1')
  })

  it('handles empty doctors list', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValue([])

    const result = await doctorService.getDoctors()
    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })
})
