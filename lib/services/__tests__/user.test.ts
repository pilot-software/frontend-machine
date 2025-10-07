import { userService } from '../user'

global.fetch = jest.fn()
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  writable: true
})

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(localStorage.getItem as jest.Mock).mockReturnValue('test-token')
  })

  it('getUsers fetches all users', async () => {
    const mockUsers = [{
      id: '1',
      email: 'admin@hospital.com',
      name: 'Admin User',
      role: 'ADMIN' as const,
      department: 'Administration',
      phone: '555-0101',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }, {
      id: '2',
      email: 'doctor@hospital.com',
      name: 'Dr. Smith',
      role: 'DOCTOR' as const,
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUsers)
    })

    const result = await userService.getUsers()
    expect(result).toEqual(mockUsers)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    })
  })

  it('getUsersByRole fetches users by specific role', async () => {
    const mockDoctors = [{
      id: '2',
      email: 'doctor@hospital.com',
      name: 'Dr. Smith',
      role: 'DOCTOR' as const,
      department: 'Cardiology',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockDoctors)
    })

    const result = await userService.getUsersByRole('DOCTOR')
    expect(result).toEqual(mockDoctors)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users/role/DOCTOR', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    })
  })

  it('createUser creates new user', async () => {
    const newUser = {
      email: 'nurse@hospital.com',
      name: 'Nurse Johnson',
      role: 'NURSE',
      department: 'Emergency'
    }
    const createdUser = {
      id: '3',
      ...newUser,
      role: 'NURSE' as const,
      status: 'ACTIVE' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(createdUser)
    })

    const result = await userService.createUser(newUser)
    expect(result).toEqual(createdUser)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(newUser)
    })
  })

  it('createUser handles API errors', async () => {
    const newUser = { email: 'invalid@test.com' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue('Invalid email format')
    })

    await expect(userService.createUser(newUser)).rejects.toThrow('Failed to create user: 400 - Invalid email format')
  })

  it('handles requests without auth token', async () => {
    ;(localStorage.getItem as jest.Mock).mockReturnValue(null)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([])
    })

    await userService.getUsers()
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
})
