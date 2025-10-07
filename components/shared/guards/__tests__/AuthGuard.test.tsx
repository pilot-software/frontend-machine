import { render, screen, waitFor } from '@testing-library/react'
import { AuthGuard } from '../AuthGuard'
import { useAuth } from '@/components/providers/AuthContext'
import { useRouter } from 'next/navigation'

jest.mock('@/components/providers/AuthContext')
jest.mock('next/navigation')

describe('AuthGuard', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('shows loading state', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      hasAnyPermission: jest.fn()
    })

    const { container } = render(<AuthGuard><div>Content</div></AuthGuard>)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects to login when no user', async () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      hasAnyPermission: jest.fn()
    })

    render(<AuthGuard><div>Content</div></AuthGuard>)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('renders children when user is authenticated', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      isLoading: false,
      hasAnyPermission: jest.fn(() => true)
    })

    render(<AuthGuard><div>Protected Content</div></AuthGuard>)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('shows access denied when permissions missing', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      isLoading: false,
      hasAnyPermission: jest.fn(() => false)
    })

    render(
      <AuthGuard requiredPermissions={['admin']}>
        <div>Admin Content</div>
      </AuthGuard>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('renders children when user has required permissions', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      isLoading: false,
      hasAnyPermission: jest.fn(() => true)
    })

    render(
      <AuthGuard requiredPermissions={['admin']}>
        <div>Admin Content</div>
      </AuthGuard>
    )

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
