export abstract class BaseEntity {
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}

