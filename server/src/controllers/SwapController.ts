import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { SwapService } from '@services/SwapService';
import { PrismaSwapRepo } from '@repositories/prisma/PrismaSwapRepo';
import { PrismaUserRepo } from '@repositories/prisma/PrismaUserRepo';

const swapService = new SwapService(new PrismaSwapRepo(), new PrismaUserRepo());

export const createSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId, offeredSkillId, requestedSkillId, message } = req.body;
    const requesterId = (req as any).user.id;
    const swap = await swapService.createSwap(requesterId, receiverId, offeredSkillId, requestedSkillId, message);
    res.status(201).json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMySwaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const swaps = await swapService.getSwapsByUserId(userId);
    res.json({ swaps });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSwapStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const swap = await swapService.updateSwapStatus(id, status);
    res.json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completeSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const swap = await swapService.completeSwap(id);
    res.json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const prisma = new PrismaClient();

export const leaveReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // swap id
    const { rating, comment, revieweeId } = req.body;
    const reviewerId = (req as any).user.id;
    
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId,
        revieweeId,
        swapRequestId: id as string
      }
    });
    res.status(201).json({ review });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
