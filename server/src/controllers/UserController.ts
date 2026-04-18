import { Request, Response } from 'express';
import { PrismaUserRepo } from '@repositories/prisma/PrismaUserRepo';

const userRepo = new PrismaUserRepo();

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await userRepo.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        rating: user.rating,
        reviewCount: user.reviewCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, bio, avatar } = req.body;

    const updatedUser = await userRepo.update(userId, {
      name,
      bio,
      avatar,
    });

    res.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        rating: updatedUser.rating,
        reviewCount: updatedUser.reviewCount,
      },
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
