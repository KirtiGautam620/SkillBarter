import { Router } from 'express';
import { authenticateToken } from '@middleware/auth';
import { 
  createSwapRequest, 
  getMySwaps, 
  acceptSwapRequest, 
  rejectSwapRequest, 
  completeSwapRequest, 
  updateSwapSession 
} from '@controllers/SwapController';

const router = Router();

router.use(authenticateToken);

router.post('/requests', createSwapRequest);
router.get('/my-swaps', getMySwaps);
router.post('/:id/accept', acceptSwapRequest);
router.post('/:id/reject', rejectSwapRequest);
router.post('/:id/complete', completeSwapRequest);
router.patch('/:id/session', updateSwapSession);

export default router;
