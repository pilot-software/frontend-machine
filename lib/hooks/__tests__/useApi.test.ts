import { renderHook, act } from '@testing-library/react'
import { useApi } from '../useApi'

describe('useApi', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useApi())
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.statusCode).toBeNull()
  })

  it('handles successful API call', async () => {
    const { result } = renderHook(() => useApi())
    const mockApiCall = jest.fn().mockResolvedValue({ id: 1, name: 'test' })

    await act(async () => {
      const response = await result.current.execute(mockApiCall)
      expect(response).toEqual({ id: 1, name: 'test' })
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual({ id: 1, name: 'test' })
    expect(result.current.error).toBeNull()
    expect(result.current.statusCode).toBe(200)
  })

  it('handles API error', async () => {
    const onError = jest.fn()
    const { result } = renderHook(() => useApi({ onError }))
    const mockApiCall = jest.fn().mockRejectedValue(new Error('API Error'))

    await act(async () => {
      try {
        await result.current.execute(mockApiCall)
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('API Error')
    expect(result.current.statusCode).toBe(500)
    expect(onError).toHaveBeenCalledWith('API Error')
  })

  it('handles auth errors without throwing', async () => {
    const { result } = renderHook(() => useApi())
    const mockApiCall = jest.fn().mockRejectedValue(new Error('Authentication required'))

    await act(async () => {
      const response = await result.current.execute(mockApiCall)
      expect(response).toBeNull()
    })

    expect(result.current.error).toBe('Authentication required')
  })

  it('resets state', () => {
    const { result } = renderHook(() => useApi())
    
    act(() => {
      result.current.reset()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.statusCode).toBeNull()
  })
})
