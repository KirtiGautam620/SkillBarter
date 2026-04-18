import { NotificationEntity } from '@entities/NotificationEntity';
import { INotificationRepo } from '@repositories/interfaces/INotificationRepo';
import crypto from 'crypto';

export class NotificationService {
  private notificationRepo: INotificationRepo;

  constructor(notificationRepo: INotificationRepo) {
    this.notificationRepo = notificationRepo;
  }

  async notify(userId: string, type: string, title: string, message: string): Promise<NotificationEntity> {
    const notification = new NotificationEntity(
      crypto.randomUUID(),
      userId,
      type,
      title,
      message
    );
    return await this.notificationRepo.create(notification);
  }

  async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    return await this.notificationRepo.findByUserId(userId);
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepo.markAsRead(id);
  }

  async clearNotifications(userId: string): Promise<void> {
    await this.notificationRepo.deleteByUserId(userId);
  }
}
