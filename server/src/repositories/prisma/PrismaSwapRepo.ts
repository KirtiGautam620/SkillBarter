import { PrismaClient } from '@prisma/client';
import { SwapRequestEntity } from '@entities/SwapRequestEntity';
import { ISwapRepo } from '../interfaces/ISwapRepo';

export class PrismaSwapRepo implements ISwapRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async findById(id: string): Promise<SwapRequestEntity | null> {
    const swap = await this.prisma.swapRequest.findUnique({ where: { id } });
    if (!swap) return null;
    const swapEntity = new SwapRequestEntity(swap.id, swap.requesterId, swap.receiverId, swap.offeredSkillId, swap.requestedSkillId, swap.createdAt, swap.updatedAt);
    if (swap.message !== null) swapEntity.message = swap.message;
    swapEntity.status = swap.status;
    swapEntity.hoursOffered = swap.hoursOffered;
    return swapEntity;
  }
  async create(swap: SwapRequestEntity): Promise<SwapRequestEntity> {
    const newSwap = await this.prisma.swapRequest.create({
      data: {
        id: swap.id,
        message: swap.message ?? null,
        status: swap.status,
        hoursOffered: swap.hoursOffered,
        requesterId: swap.requesterId,
        receiverId: swap.receiverId,
        offeredSkillId: swap.offeredSkillId,
        requestedSkillId: swap.requestedSkillId,
      }
    });
    const newSwapEntity = new SwapRequestEntity(newSwap.id, newSwap.requesterId, newSwap.receiverId, newSwap.offeredSkillId, newSwap.requestedSkillId, newSwap.createdAt, newSwap.updatedAt);
    if (newSwap.message !== null) newSwapEntity.message = newSwap.message;
    newSwapEntity.status = newSwap.status;
    newSwapEntity.hoursOffered = newSwap.hoursOffered;
    return newSwapEntity;
  }
  async updateStatus(id: string, status: string): Promise<SwapRequestEntity> {
    const updatedSwap = await this.prisma.swapRequest.update({
      where: { id },
      data: { status },
    });
    const swapEntity = new SwapRequestEntity(updatedSwap.id, updatedSwap.requesterId, updatedSwap.receiverId, updatedSwap.offeredSkillId, updatedSwap.requestedSkillId, updatedSwap.createdAt, updatedSwap.updatedAt);
    if (updatedSwap.message !== null) swapEntity.message = updatedSwap.message;
    swapEntity.status = updatedSwap.status;
    swapEntity.hoursOffered = updatedSwap.hoursOffered;
    return swapEntity;
  }
  async findByUserId(userId: string): Promise<SwapRequestEntity[]> {
    const swaps = await this.prisma.swapRequest.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        requestedSkill: true,
        offeredSkill: true,
        requester: true,
        receiver: true,
      },
    });
    return swaps.map(swap => {
      const swapEntity = new SwapRequestEntity(swap.id, swap.requesterId, swap.receiverId, swap.offeredSkillId, swap.requestedSkillId, swap.createdAt, swap.updatedAt);
      if (swap.message !== null) swapEntity.message = swap.message;
      swapEntity.status = swap.status;
      swapEntity.hoursOffered = swap.hoursOffered;
      (swapEntity as any).requestedSkillTitle = swap.requestedSkill?.title ?? swap.requestedSkillId;
      (swapEntity as any).offeredSkillTitle = swap.offeredSkill?.title ?? swap.offeredSkillId;
      (swapEntity as any).requesterName = swap.requester?.name ?? swap.requesterId;
      (swapEntity as any).receiverName = swap.receiver?.name ?? swap.receiverId;
      return swapEntity;
    });
  }
}

