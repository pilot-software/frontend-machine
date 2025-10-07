import { renderHook } from '@testing-library/react'
import { usePermissions } from '../usePermissions'
import { AuthProvider } from '@/components/providers/AuthContext'

jest.mock('@/lib/services/storage.service')
jest.mock('@/lib/services/auth')
jest.mock('@/lib/services/permission')
jest.mock('@/lib/api/client')
jest.mock('@/lib/api')

const mockAuthContext = {
  permissions: [
    { name: 'PATIENT_VIEW' },
    { name: 'APPOINTMENT_MANAGEMENT' },
    { name: 'CLINICAL_RECORDS' }
  ],
  hasPermission: jest.fn(),
  hasAnyPermission: jest.fn()
}

jest.mock('@/components/providers/AuthContext', () => ({
  ...jest.requireActual('@/components/providers/AuthContext'),
  useAuth: () => mockAuthContext
}))

describe('usePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns permission functions', () => {
    const { result } = renderHook(() => usePermissions())
    
    expect(result.current.permissions).toBeDefined()
    expect(result.current.hasPermission).toBeDefined()
    expect(result.current.hasAnyPermission).toBeDefined()
    expect(typeof result.current.canViewPatients).toBe('function')
    expect(typeof result.current.canManagePatients).toBe('function')
  })

  it('canViewPatients checks correct permissions', () => {
    mockAuthContext.hasAnyPermission.mockReturnValue(true)
    const { result } = renderHook(() => usePermissions())
    
    result.current.canViewPatients()
    expect(mockAuthContext.hasAnyPermission).toHaveBeenCalledWith(['PATIENT_VIEW', 'PATIENT_MANAGEMENT'])
  })

  it('canManagePatients checks correct permission', () => {
    mockAuthContext.hasPermission.mockReturnValue(true)
    const { result } = renderHook(() => usePermissions())
    
    result.current.canManagePatients()
    expect(mockAuthContext.hasPermission).toHaveBeenCalledWith('PATIENT_MANAGEMENT')
  })

  it('canViewAppointments checks correct permissions', () => {
    mockAuthContext.hasAnyPermission.mockReturnValue(true)
    const { result } = renderHook(() => usePermissions())
    
    result.current.canViewAppointments()
    expect(mockAuthContext.hasAnyPermission).toHaveBeenCalledWith(['APPOINTMENT_VIEW', 'APPOINTMENT_MANAGEMENT'])
  })

  it('canViewClinicalRecords checks correct permission', () => {
    mockAuthContext.hasPermission.mockReturnValue(true)
    const { result } = renderHook(() => usePermissions())
    
    result.current.canViewClinicalRecords()
    expect(mockAuthContext.hasPermission).toHaveBeenCalledWith('CLINICAL_RECORDS')
  })

  it('canManageUsers checks correct permission', () => {
    mockAuthContext.hasPermission.mockReturnValue(false)
    const { result } = renderHook(() => usePermissions())
    
    const canManage = result.current.canManageUsers()
    expect(mockAuthContext.hasPermission).toHaveBeenCalledWith('USER_MANAGEMENT')
    expect(canManage).toBe(false)
  })
})
