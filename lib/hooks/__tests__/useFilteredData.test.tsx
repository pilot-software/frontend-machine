import React from 'react'
import { renderHook } from '@testing-library/react'
import { useFilteredData } from '../useFilteredData'
import { AuthProvider } from '@/components/providers/AuthContext'

jest.mock('@/lib/services/storage.service')
jest.mock('@/lib/services/auth')
jest.mock('@/lib/services/permission')
jest.mock('@/lib/api/client')
jest.mock('@/lib/api')

const mockUser = { id: '1', email: 'test@test.com', role: 'admin' as const }

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useFilteredData', () => {
  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@test.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@test.com', status: 'inactive' },
    { id: '3', name: 'Bob Johnson', email: 'bob@test.com', status: 'active' }
  ]

  it('filters data by search term', () => {
    const { result } = renderHook(
      () => useFilteredData(
        mockData,
        'john',
        {},
        ['name', 'email'],
        {}
      ),
      { wrapper }
    )

    expect(result.current).toHaveLength(2) // John Doe and Bob Johnson
  })

  it('filters data by active filters', () => {
    const { result } = renderHook(
      () => useFilteredData(
        mockData,
        '',
        { status: 'active' },
        ['name'],
        { status: 'status' }
      ),
      { wrapper }
    )

    expect(result.current).toHaveLength(2)
    expect(result.current.every(item => item.status === 'active')).toBe(true)
  })

  it('combines search and filter', () => {
    const { result } = renderHook(
      () => useFilteredData(
        mockData,
        'doe',
        { status: 'active' },
        ['name'],
        { status: 'status' }
      ),
      { wrapper }
    )

    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('John Doe')
  })

  it('returns all data when no filters', () => {
    const { result } = renderHook(
      () => useFilteredData(
        mockData,
        '',
        {},
        ['name'],
        {}
      ),
      { wrapper }
    )

    expect(result.current).toHaveLength(3)
  })
})
