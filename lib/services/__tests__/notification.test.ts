import { notificationService } from '../notification'
import { api } from '../../api'

jest.mock('../../api')

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getNotifications fetches all notifications', async () => {
    const mockNotifications = [{
      id: '1',
      userId: 'user1',
      title: 'Appointment Reminder',
      message: 'You have an appointment tomorrow at 2 PM',
      type: 'INFO' as const,
      read: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }, {
      id: '2',
      userId: 'user1',
      title: 'Lab Results Ready',
      message: 'Your blood test results are now available',
      type: 'SUCCESS' as const,
      read: true,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(mockNotifications)

    const result = await notificationService.getNotifications()
    expect(result).toEqual(mockNotifications)
    expect(api.get).toHaveBeenCalledWith('/notifications')
  })

  it('markAsRead marks notification as read', async () => {
    ;(api.put as jest.Mock).mockResolvedValue(undefined)

    await notificationService.markAsRead('1')
    expect(api.put).toHaveBeenCalledWith('/notifications/1/read', {})
  })

  it('handles different notification types', async () => {
    const notifications = [{
      id: '1',
      userId: 'user1',
      title: 'Error',
      message: 'System error occurred',
      type: 'ERROR' as const,
      read: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }, {
      id: '2',
      userId: 'user1',
      title: 'Warning',
      message: 'Please update your profile',
      type: 'WARNING' as const,
      read: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(api.get as jest.Mock).mockResolvedValue(notifications)

    const result = await notificationService.getNotifications()
    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('ERROR')
    expect(result[1].type).toBe('WARNING')
  })
})
