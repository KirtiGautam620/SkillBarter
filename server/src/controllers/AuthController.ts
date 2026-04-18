import { Request, Response } from 'express';
import { AuthService } from '@services/AuthService';
import { TimeCreditService } from '@services/TimeCreditService';
import { PrismaUserRepo } from '@repositories/prisma/PrismaUserRepo';
import { PrismaTimeCreditRepo } from '@repositories/prisma/PrismaTimeCreditRepo';

const userRepo = new PrismaUserRepo();
const creditRepo = new PrismaTimeCreditRepo();
const creditService = new TimeCreditService(creditRepo);
const authService = new AuthService(userRepo, creditService);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register(name, email, password);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token, message: 'User registered' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
