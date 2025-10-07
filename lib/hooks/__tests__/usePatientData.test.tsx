import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { usePatientData } from '../usePatientData'
import appSlice from '../../store/slices/appSlice'

const mockStore = configureStore({
  reducer: {
    app: appSlice
  },
  preloadedState: {
    app: {
      stats: null,
      doctors: [
        { id: 'doc1', name: 'Dr. Smith' },
        { id: 'doc2', name: 'Dr. Jones' }
      ],
      patients: [
        {
          id: 'pat1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '123-456-7890',
          dateOfBirth: '1990-01-01',
          gender: 'MALE',
          assignedDoctorId: 'doc1',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      loading: { stats: false, doctors: false, patients: false },
      error: { stats: null, doctors: null, patients: null }
    }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
)

describe('usePatientData', () => {
  it('transforms patient data correctly', () => {
    const { result } = renderHook(() => usePatientData(), { wrapper })
    
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({
      id: 'pat1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '123-456-7890',
      assignedDoctor: 'Dr. Smith',
      assignedDoctorId: 'doc1'
    })
  })

  it('handles empty patient data', () => {
    const emptyStore = configureStore({
      reducer: { app: appSlice },
      preloadedState: {
        app: {
          stats: null,
          doctors: [],
          patients: [],
          loading: { stats: false, doctors: false, patients: false },
          error: { stats: null, doctors: null, patients: null }
        }
      }
    })

    const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={emptyStore}>{children}</Provider>
    )

    const { result } = renderHook(() => usePatientData(), { wrapper: emptyWrapper })
    expect(result.current).toEqual([])
  })

  it('handles missing doctor assignment', () => {
    const storeWithoutDoctor = configureStore({
      reducer: { app: appSlice },
      preloadedState: {
        app: {
          stats: null,
          doctors: [],
          patients: [{
            id: 'pat1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com'
          }],
          loading: { stats: false, doctors: false, patients: false },
          error: { stats: null, doctors: null, patients: null }
        }
      }
    })

    const wrapperWithoutDoctor = ({ children }: { children: React.ReactNode }) => (
      <Provider store={storeWithoutDoctor}>{children}</Provider>
    )

    const { result } = renderHook(() => usePatientData(), { wrapper: wrapperWithoutDoctor })
    expect(result.current[0].assignedDoctor).toBeUndefined()
  })
})
