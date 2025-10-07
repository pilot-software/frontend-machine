import { renderHook, act } from '@testing-library/react'
import { useWindowSize, useResponsive, useBreakpoint, useOrientation } from '../useResponsive'

describe('useResponsive hooks', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 })
  })

  describe('useWindowSize', () => {
    it('returns initial window size', () => {
      const { result } = renderHook(() => useWindowSize())
      expect(result.current.width).toBe(1024)
      expect(result.current.height).toBe(768)
    })

    it('updates on window resize', () => {
      const { result } = renderHook(() => useWindowSize())
      
      act(() => {
        window.innerWidth = 1280
        window.innerHeight = 800
        window.dispatchEvent(new Event('resize'))
      })

      expect(result.current.width).toBe(1280)
      expect(result.current.height).toBe(800)
    })
  })

  describe('useResponsive', () => {
    it('detects mobile', () => {
      window.innerWidth = 500
      const { result } = renderHook(() => useResponsive())
      expect(result.current.isMobile).toBe(true)
      expect(result.current.isTablet).toBe(false)
      expect(result.current.isDesktop).toBe(false)
    })

    it('detects tablet', () => {
      window.innerWidth = 800
      const { result } = renderHook(() => useResponsive())
      expect(result.current.isMobile).toBe(false)
      expect(result.current.isTablet).toBe(true)
      expect(result.current.isDesktop).toBe(false)
    })

    it('detects desktop', () => {
      window.innerWidth = 1200
      const { result } = renderHook(() => useResponsive())
      expect(result.current.isDesktop).toBe(true)
      expect(result.current.isLarge).toBe(false)
    })

    it('detects large screen', () => {
      window.innerWidth = 1400
      const { result } = renderHook(() => useResponsive())
      expect(result.current.isLarge).toBe(true)
    })
  })

  describe('useBreakpoint', () => {
    it('returns true for sm breakpoint', () => {
      window.innerWidth = 700
      const { result } = renderHook(() => useBreakpoint('sm'))
      expect(result.current).toBe(true)
    })

    it('returns false below breakpoint', () => {
      window.innerWidth = 600
      const { result } = renderHook(() => useBreakpoint('md'))
      expect(result.current).toBe(false)
    })

    it('handles xl breakpoint', () => {
      window.innerWidth = 1300
      const { result } = renderHook(() => useBreakpoint('xl'))
      expect(result.current).toBe(true)
    })
  })

  describe('useOrientation', () => {
    it('detects landscape', () => {
      window.innerWidth = 1024
      window.innerHeight = 768
      const { result } = renderHook(() => useOrientation())
      expect(result.current).toBe('landscape')
    })

    it('detects portrait', () => {
      window.innerWidth = 768
      window.innerHeight = 1024
      const { result } = renderHook(() => useOrientation())
      expect(result.current).toBe('portrait')
    })
  })
})
