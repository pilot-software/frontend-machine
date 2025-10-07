import { queueService } from '../queue'
import { apiClient } from '../../api'

jest.mock('../../api')

describe('queueService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getQueues fetches all queue items', async () => {
    const mockQueues = [{
      id: '1',
      patientId: 'pat1',
      queueType: 'MEDICAL' as const,
      priority: 1,
      status: 'WAITING' as const,
      notes: 'Routine checkup',
      createdAt: '2024-01-01T00:00:00Z'
    }, {
      id: '2',
      patientId: 'pat2',
      queueType: 'NURSING' as const,
      priority: 2,
      status: 'IN_PROGRESS' as const,
      createdAt: '2024-01-01T01:00:00Z'
    }]
    ;(apiClient.getQueues as jest.Mock).mockResolvedValue(mockQueues)

    const result = await queueService.getQueues()
    expect(result).toEqual(mockQueues)
    expect(apiClient.getQueues).toHaveBeenCalled()
  })

  it('assignToQueue assigns patient to queue', async () => {
    const queueData = {
      patientId: 'pat1',
      queueType: 'MEDICAL' as const,
      priority: 1,
      notes: 'Emergency visit'
    }
    const assignedQueue = {
      id: '3',
      ...queueData,
      status: 'WAITING' as const,
      createdAt: '2024-01-01T00:00:00Z'
    }
    ;(apiClient.assignToQueue as jest.Mock).mockResolvedValue(assignedQueue)

    const result = await queueService.assignToQueue(queueData)
    expect(result).toEqual(assignedQueue)
    expect(apiClient.assignToQueue).toHaveBeenCalledWith(queueData)
  })

  it('updateQueueStatus updates queue item status', async () => {
    const statusData = {
      status: 'COMPLETED' as const,
      notes: 'Visit completed successfully'
    }
    const updatedQueue = {
      id: '1',
      patientId: 'pat1',
      queueType: 'MEDICAL' as const,
      priority: 1,
      status: 'COMPLETED' as const,
      notes: 'Visit completed successfully',
      createdAt: '2024-01-01T00:00:00Z'
    }
    ;(apiClient.updateQueueStatus as jest.Mock).mockResolvedValue(updatedQueue)

    const result = await queueService.updateQueueStatus('1', statusData)
    expect(result).toEqual(updatedQueue)
    expect(apiClient.updateQueueStatus).toHaveBeenCalledWith('1', statusData)
  })

  it('handles different queue types', async () => {
    const medicalQueue = {
      patientId: 'pat1',
      queueType: 'MEDICAL' as const,
      priority: 1
    }
    const nursingQueue = {
      patientId: 'pat2',
      queueType: 'NURSING' as const,
      priority: 2
    }

    ;(apiClient.assignToQueue as jest.Mock)
      .mockResolvedValueOnce({ id: '1', ...medicalQueue, status: 'WAITING', createdAt: '2024-01-01T00:00:00Z' })
      .mockResolvedValueOnce({ id: '2', ...nursingQueue, status: 'WAITING', createdAt: '2024-01-01T00:00:00Z' })

    const medicalResult = await queueService.assignToQueue(medicalQueue)
    const nursingResult = await queueService.assignToQueue(nursingQueue)

    expect(medicalResult.queueType).toBe('MEDICAL')
    expect(nursingResult.queueType).toBe('NURSING')
  })
})
