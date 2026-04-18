import { Router } from 'express';
import { authenticateToken } from '@middleware/auth';
import { createReview, getUserReviews } from '@controllers/ReviewController';

const router = Router();

router.post('/', authenticateToken, createReview);
router.get('/user/:userId', getUserReviews);

export default router;
