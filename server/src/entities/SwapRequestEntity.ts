import { BaseEntity } from './BaseEntity';

export class SwapRequestEntity extends BaseEntity {
  public message?: string;
  public status: string = 'PENDING';
  public hoursOffered: number = 1;
  public requesterId: string;
  public receiverId: string;
  public offeredSkillId: string;
  public requestedSkillId: string;

  constructor(id: string, requesterId: string, receiverId: string, offeredSkillId: string, requestedSkillId: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.requesterId = requesterId;
    this.receiverId = receiverId;
    this.offeredSkillId = offeredSkillId;
    this.requestedSkillId = requestedSkillId;
  }

  accept(): void {
    this.status = 'ACCEPTED';
    this.updateTimestamp();
  }

  complete(): void {
    this.status = 'COMPLETED';
    this.updateTimestamp();
  }

  reject(): void {
    this.status = 'REJECTED';
    this.updateTimestamp();
  }
}

