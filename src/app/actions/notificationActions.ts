'use server';

import { NotificationService } from '@/services/NotificationService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  CreateNotificationDTO,
  NotificationResponse,
  UpdateNotificationDTO,
} from '@/services/types/notifications';

export async function getAllNotificationsAction() {
  const response = await withAuthentication(
    NotificationService.getAllNotifications
  );

  return {
    success: true,
    data: response as NotificationResponse[],
  };
}

export async function getAllNotificationsByPatientAction(patientId: string) {
  const response = await withAuthentication(() =>
    NotificationService.getAllNotificationsByPatient(patientId)
  );

  return {
    success: true,
    data: response as NotificationResponse[],
  };
}

export async function getNotificationAction(id: string) {
  const response = await withAuthentication(() =>
    NotificationService.getNotification(id)
  );

  return {
    success: true,
    data: response as NotificationResponse,
  };
}

export async function createNotificationAction(data: CreateNotificationDTO) {
  const response = await withAuthentication(() =>
    NotificationService.createNotification(data)
  );

  return {
    success: true,
    data: response as NotificationResponse,
  };
}

export async function updateNotificationAction(
  id: string,
  data: UpdateNotificationDTO
) {
  const response = await withAuthentication(() =>
    NotificationService.updateNotification({ id, updateData: data })
  );

  return {
    success: true,
    data: response as NotificationResponse,
  };
}

export async function deleteNotificationAction(id: string) {
  await withAuthentication(() => NotificationService.deleteNotification(id));

  return {
    success: true,
  };
}
