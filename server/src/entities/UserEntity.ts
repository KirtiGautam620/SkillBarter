import { BaseEntity } from './BaseEntity';

export class UserEntity extends BaseEntity {
  public name: string;
  public email: string;
  public password: string;
  public bio?: string;
  public avatar?: string;
  public rating: number = 0;
  public reviewCount: number = 0;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    bio?: string,
    avatar?: string,
    rating: number = 0,
    reviewCount: number = 0,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.avatar = avatar;
    this.rating = rating;
    this.reviewCount = reviewCount;
  }

  addReview(rating: number, comment: string): void {
    this.rating = ((this.rating * this.reviewCount) + rating) / (this.reviewCount + 1);
    this.reviewCount += 1;
    this.updateTimestamp();
  }
}

