import {apiClient} from '../api';

export interface QueueItem {
  id: string;
  patientId: string;
  queueType: 'MEDICAL' | 'NURSING';
  priority: number;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export interface QueueAssignmentRequest {
  patientId: string;
  queueType: 'MEDICAL' | 'NURSING';
  priority: number;
  notes?: string;
}

export interface QueueStatusUpdate {
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string;
}

export class QueueService {
  async getQueues(): Promise<QueueItem[]> {
    return apiClient.getQueues();
  }

  async assignToQueue(queueData: QueueAssignmentRequest): Promise<QueueItem> {
    return apiClient.assignToQueue(queueData);
  }

  async updateQueueStatus(id: string, statusData: QueueStatusUpdate): Promise<QueueItem> {
    return apiClient.updateQueueStatus(id, statusData);
  }
}

export const queueService = new QueueService();
