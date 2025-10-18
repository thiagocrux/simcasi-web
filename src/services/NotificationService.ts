import {
  CreateNotificationDTO,
  NotificationResponse,
  UpdateNotificationDTO,
} from './types/notifications';

import { httpClient } from './utils/httpClient';

export class NotificationService {
  static async getNotification(id: string): Promise<NotificationResponse> {
    const { data } = await httpClient.get(`/notifications/${id}`);
    return data;
  }

  static async getAllNotifications(): Promise<NotificationResponse[]> {
    const { data } = await httpClient.get('/notifications');
    return data;
  }

  static async getAllNotificationsByPatient(
    patientId: string
  ): Promise<NotificationResponse[]> {
    const { data } = await httpClient.get(
      `/notifications/patient/${patientId}`
    );

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
    const { data } = await httpClient.put(`/notifications/${id}`, updateData);
    return data;
  }

  static async deleteNotification(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/notifications/${id}`);
    return data;
  }
}
