import { BaseEntity } from './BaseEntity';

export class ReviewEntity extends BaseEntity {
  public rating: number;
  public comment?: string;
  public reviewerId: string;
  public revieweeId: string;
  public swapRequestId: string;

  constructor(
    id: string,
    rating: number,
    reviewerId: string,
    revieweeId: string,
    swapRequestId: string,
    comment?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.rating = rating;
    this.comment = comment;
    this.reviewerId = reviewerId;
    this.revieweeId = revieweeId;
    this.swapRequestId = swapRequestId;
  }
}
