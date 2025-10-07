import { LocalStorageService } from '../storage.service'

describe('LocalStorageService', () => {
  let service: LocalStorageService
  let mockLocalStorage: { [key: string]: string }

  beforeEach(() => {
    service = new LocalStorageService()
    mockLocalStorage = {}

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage[key] = value
        }),
        removeItem: jest.fn((key) => {
          delete mockLocalStorage[key]
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {}
        }),
      },
      writable: true,
    })
  })

  it('gets item from localStorage', () => {
    mockLocalStorage['test'] = 'value'
    expect(service.getItem('test')).toBe('value')
  })

  it('returns null for non-existent item', () => {
    expect(service.getItem('nonexistent')).toBeNull()
  })

  it('sets item in localStorage', () => {
    service.setItem('key', 'value')
    expect(mockLocalStorage['key']).toBe('value')
  })

  it('removes item from localStorage', () => {
    mockLocalStorage['key'] = 'value'
    service.removeItem('key')
    expect(mockLocalStorage['key']).toBeUndefined()
  })

  it('clears all items', () => {
    mockLocalStorage['key1'] = 'value1'
    mockLocalStorage['key2'] = 'value2'
    service.clear()
    expect(Object.keys(mockLocalStorage).length).toBe(0)
  })

  it('handles errors gracefully', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    ;(window.localStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    expect(service.getItem('test')).toBeNull()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
