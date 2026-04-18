import { NotificationEntity } from '@entities/NotificationEntity';

export interface INotificationRepo {
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  markAsRead(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
