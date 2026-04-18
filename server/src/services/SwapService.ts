import { SwapRequestEntity } from '@entities/SwapRequestEntity';
import { ISwapRepo } from '@repositories/interfaces/ISwapRepo';
import { IUserRepo } from '@repositories/interfaces/IUserRepo';
import { TimeCreditService } from './TimeCreditService';
import { NotificationService } from './NotificationService';
import crypto from 'crypto';

export class SwapService {
  private swapRepo: ISwapRepo;
  private userRepo: IUserRepo;
  private creditService: TimeCreditService;
  private notificationService: NotificationService;

  constructor(
    swapRepo: ISwapRepo,
    userRepo: IUserRepo,
    creditService: TimeCreditService,
    notificationService: NotificationService
  ) {
    this.swapRepo = swapRepo;
    this.userRepo = userRepo;
    this.creditService = creditService;
    this.notificationService = notificationService;
  }

  async createSwap(
    requesterId: string,
    receiverId: string,
    offeredSkillId: string,
    requestedSkillId: string,
    message?: string,
    hoursOffered: number = 1
  ): Promise<SwapRequestEntity> {
    if (!requester || !receiver) {
      throw new Error('User not found');
    }

    if (requesterId === receiverId) {
      throw new Error('You cannot request a swap for your own skill!');
    }

    // Check if requester has enough credits
    const account = await this.creditService.getAccount(requesterId);
    if (!account.canAfford(hoursOffered)) {
      throw new Error('Insufficient time credits to request this swap');
    }

    const id = crypto.randomUUID();
    const swap = new SwapRequestEntity(id, requesterId, receiverId, offeredSkillId, requestedSkillId);
    swap.message = message;
    swap.hoursOffered = hoursOffered;

    const createdSwap = await this.swapRepo.create(swap);

    await this.notificationService.notify(
      receiverId,
      'SWAP_REQUESTED',
      'New Swap Request',
      `${requester.name} wants to swap skills with you.`
    );

    return createdSwap;
  }

  async acceptSwap(id: string): Promise<SwapRequestEntity> {
    const swap = await this.swapRepo.findById(id);
    if (!swap) throw new Error('Swap not found');
    if (swap.status !== 'PENDING') throw new Error('Swap is not in PENDING status');

    // Reserve credits from requester
    await this.creditService.reserveCredits(swap.requesterId, swap.hoursOffered);

    const updated = await this.swapRepo.updateStatus(id, 'ACCEPTED');

    // AUTO-CREATE SESSION for communication
    const meetingId = id.split('-')[0]; // Simple unique meeting ID
    const meetingLink = `https://meet.google.com/sb-${meetingId}`;
    
    await this.swapRepo.createSession(id, meetingLink);

    await this.notificationService.notify(
      swap.requesterId,
      'SWAP_ACCEPTED',
      'Swap Request Accepted',
      `Your swap request has been accepted. Join here: ${meetingLink}`
    );

    return updated;
  }

  async rejectSwap(id: string): Promise<SwapRequestEntity> {
    const swap = await this.swapRepo.findById(id);
    if (!swap) throw new Error('Swap not found');

    const updated = await this.swapRepo.updateStatus(id, 'REJECTED');

    await this.notificationService.notify(
      swap.requesterId,
      'SWAP_REJECTED',
      'Swap Request Rejected',
      `Your swap request was rejected.`
    );

    return updated;
  }

  async completeSwap(id: string): Promise<SwapRequestEntity> {
    const swap = await this.swapRepo.findById(id);
    if (!swap) throw new Error('Swap not found');
    if (swap.status !== 'ACCEPTED') throw new Error('Swap must be ACCEPTED to be completed');

    // Transfer credits from requester to receiver
    await this.creditService.transferCredits(swap.requesterId, swap.receiverId, swap.hoursOffered);

    const updated = await this.swapRepo.updateStatus(id, 'COMPLETED');

    await this.notificationService.notify(
      swap.requesterId,
      'SWAP_COMPLETED',
      'Swap Completed',
      `The skill swap has been marked as completed.`
    );
    await this.notificationService.notify(
      swap.receiverId,
      'SWAP_COMPLETED',
      'Swap Completed',
      `The skill swap has been marked as completed.`
    );

    return updated;
  }

  async updateSwapStatus(id: string, status: string): Promise<SwapRequestEntity> {
    return await this.swapRepo.updateStatus(id, status);
  }

  async getSwapsByUserId(userId: string): Promise<SwapRequestEntity[]> {
    return await this.swapRepo.findByUserId(userId);
  }
}
