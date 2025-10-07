import { dashboardService } from '../dashboard'
import { apiClient } from '../../api'

jest.mock('../../api')

describe('dashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDashboardStats fetches dashboard stats', async () => {
    const mockStats = {
      totalPatients: 100,
      newPatientsThisMonth: 15,
      todayAppointments: 25,
      criticalCases: 3,
      dischargedToday: 8,
      revenue: {
        monthly: 50000,
        pendingPayments: 5000
      }
    }
    ;(apiClient.getDashboardData as jest.Mock).mockResolvedValue(mockStats)

    const result = await dashboardService.getDashboardStats()
    expect(result).toEqual(mockStats)
    expect(apiClient.getDashboardData).toHaveBeenCalledWith(undefined)
  })

  it('getDashboardStats with branch ID', async () => {
    const mockStats = { totalPatients: 50 }
    ;(apiClient.getDashboardData as jest.Mock).mockResolvedValue(mockStats)

    const result = await dashboardService.getDashboardStats('branch1')
    expect(result).toEqual(mockStats)
    expect(apiClient.getDashboardData).toHaveBeenCalledWith('branch1')
  })

  it('getFinancialStats fetches financial data', async () => {
    const mockFinancial = {
      totalRevenue: 100000,
      totalPaid: 80000,
      outstandingAmount: 20000,
      monthlyRevenue: { Jan: 10000, Feb: 12000 },
      revenueByPaymentMethod: { cash: 30000, card: 50000 }
    }
    ;(apiClient.getFinancialStats as jest.Mock).mockResolvedValue(mockFinancial)

    const result = await dashboardService.getFinancialStats()
    expect(result).toEqual(mockFinancial)
  })

  it('getPatientStats fetches patient statistics', async () => {
    const mockPatientStats = {
      totalPatients: 500,
      newPatientsThisMonth: 25,
      activePatients: 450,
      patientsByGender: { male: 250, female: 250 },
      patientsByAgeGroup: { '0-18': 100, '19-65': 300, '65+': 100 }
    }
    ;(apiClient.getPatientStats as jest.Mock).mockResolvedValue(mockPatientStats)

    const result = await dashboardService.getPatientStats()
    expect(result).toEqual(mockPatientStats)
  })

  it('getAppointmentStats fetches appointment statistics', async () => {
    const mockAppointmentStats = {
      totalAppointments: 200,
      todayAppointments: 15,
      upcomingAppointments: 50,
      completedAppointments: 120,
      cancelledAppointments: 15,
      appointmentsByStatus: { scheduled: 50, completed: 120, cancelled: 15 }
    }
    ;(apiClient.getAppointmentStats as jest.Mock).mockResolvedValue(mockAppointmentStats)

    const result = await dashboardService.getAppointmentStats()
    expect(result).toEqual(mockAppointmentStats)
  })
})
