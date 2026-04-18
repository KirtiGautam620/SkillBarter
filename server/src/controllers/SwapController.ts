import { Request, Response } from 'express';
import { SwapService } from '@services/SwapService';
import { TimeCreditService } from '@services/TimeCreditService';
import { NotificationService } from '@services/NotificationService';
import { PrismaSwapRepo } from '@repositories/prisma/PrismaSwapRepo';
import { PrismaUserRepo } from '@repositories/prisma/PrismaUserRepo';
import { PrismaTimeCreditRepo } from '@repositories/prisma/PrismaTimeCreditRepo';
import { PrismaNotificationRepo } from '@repositories/prisma/PrismaNotificationRepo';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const swapRepo = new PrismaSwapRepo();
const userRepo = new PrismaUserRepo();
const creditRepo = new PrismaTimeCreditRepo();
const notificationRepo = new PrismaNotificationRepo();

const creditService = new TimeCreditService(creditRepo);
const notificationService = new NotificationService(notificationRepo);
const swapService = new SwapService(swapRepo, userRepo, creditService, notificationService);

export const createSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId, offeredSkillId, requestedSkillId, message, hoursOffered } = req.body;
    const requesterId = (req as any).user.id;
    const swap = await swapService.createSwap(requesterId, receiverId, offeredSkillId, requestedSkillId, message, hoursOffered);
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

export const acceptSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const swap = await swapService.acceptSwap(id);
    res.json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const rejectSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const swap = await swapService.rejectSwap(id);
    res.json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completeSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const swap = await swapService.completeSwap(id);
    res.json({ swap });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSwapSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { notes, meetingLink, learningVideoLink } = req.body;
    
    const session = await prisma.session.upsert({
      where: { swapRequestId: id },
      update: { notes, meetingLink, learningVideoLink },
      create: { 
        swapRequestId: id,
        notes,
        meetingLink,
        learningVideoLink,
        scheduledAt: new Date(),
      }
    });
    
    res.json({ session });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
