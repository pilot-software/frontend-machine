import { render, screen } from '@testing-library/react'
import { DashboardStats } from '../DashboardStats'
import { useAuth } from '@/components/providers/AuthContext'

jest.mock('@/components/providers/AuthContext')
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}))

describe('DashboardStats', () => {
  beforeEach(() => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { role: 'admin' }
    })
  })

  it('renders loading state', () => {
    render(<DashboardStats stats={{}} loading={true} />)
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
  })

  it('renders admin stats', () => {
    const stats = {
      totalPatients: 1247,
      activeStaff: 89,
      criticalCases: 7,
      revenue: { monthly: 342100 }
    }
    render(<DashboardStats stats={stats} loading={false} />)
    expect(screen.getByText('1247')).toBeInTheDocument()
    expect(screen.getByText('89')).toBeInTheDocument()
  })

  it('renders doctor stats', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { role: 'doctor' }
    })
    const stats = {
      myPatients: 34,
      todayAppointments: 12
    }
    render(<DashboardStats stats={stats} loading={false} />)
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders patient stats', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { role: 'patient' }
    })
    render(<DashboardStats stats={{}} loading={false} />)
    expect(screen.getByText('Tomorrow 2PM')).toBeInTheDocument()
    expect(screen.getByText('92/100')).toBeInTheDocument()
  })

  it('handles missing stats data', () => {
    render(<DashboardStats stats={null} loading={false} />)
    expect(screen.getByText('1247')).toBeInTheDocument()
  })

  it('renders with nested data structure', () => {
    const stats = {
      data: {
        totalPatients: 500,
        activeStaff: 50
      }
    }
    render(<DashboardStats stats={stats} loading={false} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })
})
