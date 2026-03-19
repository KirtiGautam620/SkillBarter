import { SwapRequestEntity } from '@entities/SwapRequestEntity';

export interface ISwapRepo {
  findById(id: string): Promise<SwapRequestEntity | null>;
  create(swap: SwapRequestEntity): Promise<SwapRequestEntity>;
  updateStatus(id: string, status: string): Promise<SwapRequestEntity>;
  findByUserId(userId: string): Promise<SwapRequestEntity[]>;
}

