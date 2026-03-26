import { Router } from 'express';
import { authenticateToken } from '@middleware/auth';
import { createSwapRequest, getMySwaps, updateSwapStatus, completeSession, leaveReview } from '@controllers/SwapController';

const router = Router();
router.use(authenticateToken);
router.post('/requests', createSwapRequest);
router.get('/my-swaps', getMySwaps);
router.patch('/:id/status', updateSwapStatus); 
router.post('/:id/complete', completeSession); 
router.post('/:id/review', leaveReview); 
export default router;
