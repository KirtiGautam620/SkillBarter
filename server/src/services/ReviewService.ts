import { ReviewEntity } from '@entities/ReviewEntity';
import { IReviewRepo } from '@repositories/interfaces/IReviewRepo';
import { IUserRepo } from '@repositories/interfaces/IUserRepo';
import crypto from 'crypto';

export class ReviewService {
  private reviewRepo: IReviewRepo;
  private userRepo: IUserRepo;

  constructor(reviewRepo: IReviewRepo, userRepo: IUserRepo) {
    this.reviewRepo = reviewRepo;
    this.userRepo = userRepo;
  }

  async createReview(rating: number, comment: string, reviewerId: string, revieweeId: string, swapRequestId: string): Promise<ReviewEntity> {
    const review = new ReviewEntity(
      crypto.randomUUID(),
      rating,
      reviewerId,
      revieweeId,
      swapRequestId,
      comment
    );
    const createdReview = await this.reviewRepo.create(review);
    const user = await this.userRepo.findById(revieweeId);
    if (user) {
      user.addReview(rating, comment);
      await this.userRepo.update(revieweeId, {
        rating: user.rating,
        reviewCount: user.reviewCount,
      });
    }
    return createdReview;
  }

  async getUserReviews(userId: string): Promise<ReviewEntity[]> {
    return await this.reviewRepo.findByUserId(userId);
  }

  async getSwapReviews(swapId: string): Promise<ReviewEntity[]> {
    return await this.reviewRepo.findBySwapId(swapId);
  }
}
