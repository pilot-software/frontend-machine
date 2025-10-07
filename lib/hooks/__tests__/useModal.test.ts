import { renderHook, act } from '@testing-library/react'
import { useModal } from '../useModal'

describe('useModal', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useModal())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.mode).toBe('add')
    expect(result.current.selectedId).toBeUndefined()
  })

  it('opens modal with add mode', () => {
    const { result } = renderHook(() => useModal())
    act(() => {
      result.current.openModal('add')
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.mode).toBe('add')
  })

  it('opens modal with edit mode and id', () => {
    const { result } = renderHook(() => useModal<string>())
    act(() => {
      result.current.openModal('edit', '123')
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.mode).toBe('edit')
    expect(result.current.selectedId).toBe('123')
  })

  it('closes modal and clears selectedId', () => {
    const { result } = renderHook(() => useModal<string>())
    act(() => {
      result.current.openModal('edit', '123')
    })
    act(() => {
      result.current.closeModal()
    })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.selectedId).toBeUndefined()
  })

  it('changes mode', () => {
    const { result } = renderHook(() => useModal())
    act(() => {
      result.current.setMode('view')
    })
    expect(result.current.mode).toBe('view')
  })

  it('sets selectedId', () => {
    const { result } = renderHook(() => useModal<number>())
    act(() => {
      result.current.setSelectedId(456)
    })
    expect(result.current.selectedId).toBe(456)
  })

  it('handles different modal modes', () => {
    const { result } = renderHook(() => useModal())
    const modes = ['add', 'edit', 'view', 'schedule', 'reschedule'] as const
    
    modes.forEach(mode => {
      act(() => {
        result.current.openModal(mode)
      })
      expect(result.current.mode).toBe(mode)
    })
  })
})
