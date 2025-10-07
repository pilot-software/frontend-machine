import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { storageService } from '@/lib/services/storage.service'

jest.mock('@/lib/services/storage.service')
jest.mock('@/lib/services/auth')
jest.mock('@/lib/services/permission')
jest.mock('@/lib/api/client')
jest.mock('@/lib/api')

const TestComponent = () => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return <div>{user ? user.email : 'No user'}</div>
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(storageService.getItem as jest.Mock).mockReturnValue(null)
  })

  it('provides auth context', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    expect(() => render(<TestComponent />)).toThrow()
    consoleError.mockRestore()
  })

  it('loads user from storage on mount', async () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'admin' }
    ;(storageService.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'healthcare_user') return JSON.stringify(mockUser)
      if (key === 'auth_token') return 'token123'
      if (key === 'user_permissions') return '[]'
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('test@test.com')).toBeInTheDocument()
    })
  })

  it('handles storage errors gracefully', async () => {
    ;(storageService.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage error')
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })

  it('handles invalid JSON in storage', async () => {
    ;(storageService.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'healthcare_user') return 'invalid-json'
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })
})
