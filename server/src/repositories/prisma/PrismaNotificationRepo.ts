import { PrismaClient } from '@prisma/client';
import { NotificationEntity } from '@entities/NotificationEntity';
import { INotificationRepo } from '../interfaces/INotificationRepo';

export class PrismaNotificationRepo implements INotificationRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(
      (n) =>
        new NotificationEntity(n.id, n.userId, n.type, n.title, n.message, n.isRead, n.createdAt)
    );
  }

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    const newN = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
      },
    });
    return new NotificationEntity(
      newN.id,
      newN.userId,
      newN.type,
      newN.title,
      newN.message,
      newN.isRead,
      newN.createdAt
    );
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({ where: { userId } });
  }
}
