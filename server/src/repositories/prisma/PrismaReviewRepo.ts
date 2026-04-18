import { PrismaClient } from '@prisma/client';
import { ReviewEntity } from '@entities/ReviewEntity';
import { IReviewRepo } from '../interfaces/IReviewRepo';

export class PrismaReviewRepo implements IReviewRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) return null;
    return new ReviewEntity(
      review.id,
      review.rating,
      review.reviewerId,
      review.revieweeId,
      review.swapRequestId,
      review.comment ?? undefined,
      review.createdAt
    );
  }

  async findByUserId(userId: string): Promise<ReviewEntity[]> {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map(
      (r) =>
        new ReviewEntity(
          r.id,
          r.rating,
          r.reviewerId,
          r.revieweeId,
          r.swapRequestId,
          r.comment ?? undefined,
          r.createdAt
        )
    );
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    const newR = await this.prisma.review.create({
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewerId: review.reviewerId,
        revieweeId: review.revieweeId,
        swapRequestId: review.swapRequestId,
      },
    });
    return new ReviewEntity(
      newR.id,
      newR.rating,
      newR.reviewerId,
      newR.revieweeId,
      newR.swapRequestId,
      newR.comment ?? undefined,
      newR.createdAt
    );
  }

  async findBySwapId(swapId: string): Promise<ReviewEntity[]> {
    const reviews = await this.prisma.review.findMany({ where: { swapRequestId: swapId } });
    return reviews.map(
      (r) =>
        new ReviewEntity(
          r.id,
          r.rating,
          r.reviewerId,
          r.revieweeId,
          r.swapRequestId,
          r.comment ?? undefined,
          r.createdAt
        )
    );
  }
}
