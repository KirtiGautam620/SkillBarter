import { BaseEntity } from './BaseEntity';

export class SkillEntity extends BaseEntity {
  public title: string;
  public description: string;
  public category: string;
  public level: string = 'Beginner';
  public isActive: boolean = true;
  public userId: string;

  constructor(id: string, title: string, description: string, category: string, userId: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.title = title;
    this.description = description;
    this.category = category;
    this.userId = userId;
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updateTimestamp();
  }
}

