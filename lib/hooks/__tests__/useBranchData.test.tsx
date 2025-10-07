import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { useBranchData, usePatients, useAppointments, useDashboardData } from '../useBranchData'
import { BranchProvider } from '@/components/providers/BranchContext'
import { AuthProvider } from '@/components/providers/AuthContext'

jest.mock('@/lib/services/storage.service')
jest.mock('@/lib/services/auth')
jest.mock('@/lib/services/permission')
jest.mock('@/lib/api/client')
jest.mock('@/lib/api')

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BranchProvider>
      {children}
    </BranchProvider>
  </AuthProvider>
)

describe('useBranchData', () => {
  const mockFetchFn = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with loading state', () => {
    mockFetchFn.mockResolvedValue({ data: 'test' })
    const { result } = renderHook(() => useBranchData(mockFetchFn), { wrapper })
    
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'test' }
    mockFetchFn.mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useBranchData(mockFetchFn), { wrapper })
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 3000 })
    
    expect(result.current.data).toBeDefined()
    expect(result.current.error).toBeNull()
  })



  it('provides refetch function', () => {
    const { result } = renderHook(() => useBranchData(mockFetchFn), { wrapper })
    expect(typeof result.current.refetch).toBe('function')
  })
})

describe('usePatients', () => {
  it('returns branch data hook', () => {
    const { result } = renderHook(() => usePatients(), { wrapper })
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
  })
})

describe('useAppointments', () => {
  it('returns branch data hook', () => {
    const { result } = renderHook(() => useAppointments(), { wrapper })
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
  })
})

describe('useDashboardData', () => {
  it('returns branch data hook', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper })
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
  })
})
