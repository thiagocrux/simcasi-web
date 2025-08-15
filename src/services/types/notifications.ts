import { CommonProperties } from './common';

export interface Notification {
  sinan: string;
  observations: string | null;
  patient: string;
}

export interface CreateNotificationDTO extends Notification {}
export interface UpdateNotificationDTO extends Partial<Notification> {}
export interface NotificationResponse extends Notification, CommonProperties {}
