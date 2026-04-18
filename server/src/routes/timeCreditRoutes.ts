import { Router } from 'express';
import { authenticateToken } from '@middleware/auth';
import { getAccountBalance } from '@controllers/TimeCreditController';

const router = Router();

router.get('/balance', authenticateToken, getAccountBalance);

export default router;
