import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useAppData } from '../useAppData'
import appSlice from '../../store/slices/appSlice'

const mockStore = configureStore({
  reducer: {
    app: appSlice
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
)

describe('useAppData', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    expect(result.current.stats).toBeNull()
    expect(result.current.doctors).toEqual([])
    expect(result.current.patients).toEqual([])
    expect(result.current.loading).toBeDefined()
    expect(result.current.error).toBeDefined()
    expect(result.current.refetch).toBeDefined()
  })

  it('provides refetch functions', () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    expect(typeof result.current.refetch.stats).toBe('function')
    expect(typeof result.current.refetch.doctors).toBe('function')
    expect(typeof result.current.refetch.patients).toBe('function')
  })
})
