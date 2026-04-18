import { PrismaClient } from '@prisma/client';
import { TimeCreditAccountEntity } from '@entities/TimeCreditAccountEntity';
import { ITimeCreditRepo } from '../interfaces/ITimeCreditRepo';

export class PrismaTimeCreditRepo implements ITimeCreditRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserId(userId: string): Promise<TimeCreditAccountEntity | null> {
    const account = await this.prisma.timeCreditAccount.findUnique({ where: { userId } });
    if (!account) return null;
    return new TimeCreditAccountEntity(
      account.id,
      account.userId,
      account.balance,
      account.reservedBalance,
      account.totalEarned,
      account.totalSpent,
      account.createdAt,
      account.updatedAt
    );
  }

  async create(account: TimeCreditAccountEntity): Promise<TimeCreditAccountEntity> {
    const newAccount = await this.prisma.timeCreditAccount.create({
      data: {
        id: account.id,
        userId: account.userId,
        balance: account.balance,
        reservedBalance: account.reservedBalance,
        totalEarned: account.totalEarned,
        totalSpent: account.totalSpent,
      },
    });
    return new TimeCreditAccountEntity(
      newAccount.id,
      newAccount.userId,
      newAccount.balance,
      newAccount.reservedBalance,
      newAccount.totalEarned,
      newAccount.totalSpent,
      newAccount.createdAt,
      newAccount.updatedAt
    );
  }

  async update(id: string, account: Partial<TimeCreditAccountEntity>): Promise<TimeCreditAccountEntity> {
    const updated = await this.prisma.timeCreditAccount.update({
      where: { id },
      data: account as any,
    });
    return new TimeCreditAccountEntity(
      updated.id,
      updated.userId,
      updated.balance,
      updated.reservedBalance,
      updated.totalEarned,
      updated.totalSpent,
      updated.createdAt,
      updated.updatedAt
    );
  }
}
