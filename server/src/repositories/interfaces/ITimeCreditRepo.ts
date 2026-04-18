import { TimeCreditAccountEntity } from '@entities/TimeCreditAccountEntity';

export interface ITimeCreditRepo {
  findByUserId(userId: string): Promise<TimeCreditAccountEntity | null>;
  create(account: TimeCreditAccountEntity): Promise<TimeCreditAccountEntity>;
  update(id: string, account: Partial<TimeCreditAccountEntity>): Promise<TimeCreditAccountEntity>;
}
