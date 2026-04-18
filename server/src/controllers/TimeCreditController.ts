import { Request, Response } from 'express';
import { TimeCreditService } from '@services/TimeCreditService';
import { PrismaTimeCreditRepo } from '@repositories/prisma/PrismaTimeCreditRepo';

const creditRepo = new PrismaTimeCreditRepo();
const creditService = new TimeCreditService(creditRepo);

export const getAccountBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const account = await creditService.getAccount(userId);
    res.json({ account });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
