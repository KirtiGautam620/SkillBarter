import { SwapRequestEntity } from '@entities/SwapRequestEntity';
import { ISwapRepo } from '@repositories/interfaces/ISwapRepo';
import { IUserRepo } from '@repositories/interfaces/IUserRepo';

export class SwapService {
  private swapRepo: ISwapRepo;
  private userRepo: IUserRepo;
  constructor(swapRepo: ISwapRepo, userRepo: IUserRepo) {
    this.swapRepo = swapRepo;
    this.userRepo = userRepo;
  }
  async createSwap(requesterId: string, receiverId: string, offeredSkillId: string, requestedSkillId: string, message?: string): Promise<SwapRequestEntity> {
    const requester = await this.userRepo.findById(requesterId);
    const receiver = await this.userRepo.findById(receiverId);
    if (!requester || !receiver) {
      throw new Error('User not found');
    }
    const swap = new SwapRequestEntity(crypto.randomUUID(), requesterId, receiverId, offeredSkillId, requestedSkillId);
    if (message !== undefined) swap.message = message;
    const createdSwap = await this.swapRepo.create(swap);
    return createdSwap;
  }
  async acceptSwap(id: string): Promise<SwapRequestEntity> {
    return await this.swapRepo.updateStatus(id, 'ACCEPTED');
  }
  async completeSwap(id: string): Promise<SwapRequestEntity> {
    return await this.swapRepo.updateStatus(id, 'COMPLETED');
  }
  async updateSwapStatus(id: string, status: string): Promise<SwapRequestEntity> {
    return await this.swapRepo.updateStatus(id, status);
  }
  async getSwapsByUserId(userId: string): Promise<SwapRequestEntity[]> {
    return await this.swapRepo.findByUserId(userId);
  }
}

