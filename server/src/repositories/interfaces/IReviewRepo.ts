import { ReviewEntity } from '@entities/ReviewEntity';

export interface IReviewRepo {
  findById(id: string): Promise<ReviewEntity | null>;
  findByUserId(userId: string): Promise<ReviewEntity[]>;
  create(review: ReviewEntity): Promise<ReviewEntity>;
  findBySwapId(swapId: string): Promise<ReviewEntity[]>;
}
