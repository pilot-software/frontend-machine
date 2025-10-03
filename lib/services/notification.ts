import {api} from '../api';

export interface ApiNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export class NotificationService {
  async getNotifications(): Promise<ApiNotification[]> {
    return api.get('/notifications');
  }

  async markAsRead(id: string): Promise<void> {
    return api.put(`/notifications/${id}/read`, {});
  }
}

export const notificationService = new NotificationService();
