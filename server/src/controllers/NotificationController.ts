import { Request, Response } from 'express';
import { NotificationService } from '@services/NotificationService';
import { PrismaNotificationRepo } from '@repositories/prisma/PrismaNotificationRepo';

const notificationRepo = new PrismaNotificationRepo();
const notificationService = new NotificationService(notificationRepo);

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json({ notifications });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await notificationService.markAsRead(id);
    res.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const clearNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await notificationService.clearNotifications(userId);
    res.json({ message: 'Notifications cleared' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
