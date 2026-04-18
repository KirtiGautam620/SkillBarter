import { BaseEntity } from './BaseEntity';

export class NotificationEntity extends BaseEntity {
  public userId: string;
  public type: string;
  public title: string;
  public message: string;
  public isRead: boolean;

  constructor(
    id: string,
    userId: string,
    type: string,
    title: string,
    message: string,
    isRead: boolean = false,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.isRead = isRead;
  }

  markAsRead(): void {
    this.isRead = true;
    this.updateTimestamp();
  }
}
