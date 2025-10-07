import { departmentService } from '../department'
import { api } from '../../api'

jest.mock('../../api')

describe('departmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDepartments fetches all departments', async () => {
    const mockDepartments = [{
      id: '1',
      name: 'Cardiology',
      description: 'Heart and cardiovascular care',
      headOfDepartment: 'Dr. Smith',
      location: 'Building A, Floor 2',
      phone: '555-0101',
      email: 'cardiology@hospital.com',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockDepartments)

    const result = await departmentService.getDepartments()
    expect(result).toEqual(mockDepartments)
    expect(api.get).toHaveBeenCalledWith('/departments')
  })

  it('getDepartment fetches single department', async () => {
    const mockDepartment = {
      id: '1',
      name: 'Emergency',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    ;(api.get as jest.Mock).mockResolvedValue(mockDepartment)

    const result = await departmentService.getDepartment('1')
    expect(result).toEqual(mockDepartment)
    expect(api.get).toHaveBeenCalledWith('/departments/1')
  })
})
