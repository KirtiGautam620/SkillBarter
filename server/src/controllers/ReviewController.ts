import { Request, Response } from 'express';
import { ReviewService } from '@services/ReviewService';
import { PrismaReviewRepo } from '@repositories/prisma/PrismaReviewRepo';
import { PrismaUserRepo } from '@repositories/prisma/PrismaUserRepo';

const reviewRepo = new PrismaReviewRepo();
const userRepo = new PrismaUserRepo();
const reviewService = new ReviewService(reviewRepo, userRepo);

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment, revieweeId, swapRequestId } = req.body;
    const reviewerId = (req as any).user.id;
    const review = await reviewService.createReview(rating, comment, reviewerId, revieweeId, swapRequestId);
    res.status(201).json({ review });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const reviews = await reviewService.getUserReviews(userId);
    res.json({ reviews });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
