import { Router } from 'express';
import { authenticateToken } from '@middleware/auth';
import { getMyNotifications, markAsRead, clearNotifications } from '@controllers/NotificationController';

const router = Router();

router.use(authenticateToken);

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/', clearNotifications);

export default router;
