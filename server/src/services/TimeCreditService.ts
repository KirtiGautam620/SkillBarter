import { TimeCreditAccountEntity } from '@entities/TimeCreditAccountEntity';
import { ITimeCreditRepo } from '@repositories/interfaces/ITimeCreditRepo';
import crypto from 'crypto';

export class TimeCreditService {
  private creditRepo: ITimeCreditRepo;

  constructor(creditRepo: ITimeCreditRepo) {
    this.creditRepo = creditRepo;
  }

  async getAccount(userId: string): Promise<TimeCreditAccountEntity> {
    let account = await this.creditRepo.findByUserId(userId);
    if (!account) {
      account = new TimeCreditAccountEntity(crypto.randomUUID(), userId);
      await this.creditRepo.create(account);
    }
    return account;
  }

  async reserveCredits(userId: string, amount: number): Promise<void> {
    const account = await this.getAccount(userId);
    account.reserve(amount);
    await this.creditRepo.update(account.id, {
      reservedBalance: account.reservedBalance,
    });
  }

  async releaseCredits(userId: string, amount: number): Promise<void> {
    const account = await this.getAccount(userId);
    account.release(amount);
    await this.creditRepo.update(account.id, {
      reservedBalance: account.reservedBalance,
    });
  }

  async transferCredits(fromUserId: string, toUserId: string, amount: number): Promise<void> {
    const fromAccount = await this.getAccount(fromUserId);
    const toAccount = await this.getAccount(toUserId);

    fromAccount.release(amount);
    fromAccount.spend(amount);
    toAccount.earn(amount);

    await this.creditRepo.update(fromAccount.id, {
      balance: fromAccount.balance,
      reservedBalance: fromAccount.reservedBalance,
      totalSpent: fromAccount.totalSpent,
    });

    await this.creditRepo.update(toAccount.id, {
      balance: toAccount.balance,
      totalEarned: toAccount.totalEarned,
    });
  }
}
