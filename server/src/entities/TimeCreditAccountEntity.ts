import { BaseEntity } from './BaseEntity';

export class TimeCreditAccountEntity extends BaseEntity {
  public userId: string;
  public balance: number;
  public reservedBalance: number;
  public totalEarned: number;
  public totalSpent: number;

  constructor(
    id: string,
    userId: string,
    balance: number = 10,
    reservedBalance: number = 0,
    totalEarned: number = 0,
    totalSpent: number = 0,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.balance = balance;
    this.reservedBalance = reservedBalance;
    this.totalEarned = totalEarned;
    this.totalSpent = totalSpent;
  }

  canAfford(amount: number): boolean {
    return (this.balance - this.reservedBalance) >= amount;
  }

  reserve(amount: number): void {
    if (!this.canAfford(amount)) {
      throw new Error('Insufficient balance to reserve');
    }
    this.reservedBalance += amount;
    this.updateTimestamp();
  }

  release(amount: number): void {
    this.reservedBalance = Math.max(0, this.reservedBalance - amount);
    this.updateTimestamp();
  }

  spend(amount: number): void {
    if (this.balance < amount) {
      throw new Error('Insufficient balance to spend');
    }
    this.balance -= amount;
    this.totalSpent += amount;
    this.updateTimestamp();
  }

  earn(amount: number): void {
    this.balance += amount;
    this.totalEarned += amount;
    this.updateTimestamp();
  }
}
