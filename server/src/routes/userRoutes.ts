import { Router } from 'express';
import { getProfile, updateProfile } from '@controllers/UserController';
import { authenticateToken } from '@middleware/auth';

const router = Router();

router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, updateProfile);

export default router;
