import {
  CreateNotificationDTO,
  NotificationResponse,
  UpdateNotificationDTO,
} from './types/notifications';

import { httpClient } from './utils/httpClient';

export class NotificationService {
  static async getNotification(id: string): Promise<NotificationResponse> {
    const { data } = await httpClient.post(`/notifications/${id}`);
    return data;
  }

  static async getAllNotifications(): Promise<NotificationResponse[]> {
    const { data } = await httpClient.post('/notifications');
    return data;
  }

  static async createNotification(
    createData: CreateNotificationDTO
  ): Promise<NotificationResponse> {
    const { data } = await httpClient.post('/notifications', createData);
    return data;
  }

  static async updateNotification({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateNotificationDTO;
  }): Promise<NotificationResponse> {
    const { data } = await httpClient.post(`/notifications/${id}`, updateData);
    return data;
  }

  static async deleteNotification(id: string): Promise<void> {
    const { data } = await httpClient.post(`/notifications/${id}`);
    return data;
  }
}
