import { Request, Response } from 'express';
import { SkillService } from '@services/SkillService';
import { PrismaSkillRepo } from '@repositories/prisma/PrismaSkillRepo';

const skillService = new SkillService(new PrismaSkillRepo());

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, level } = req.body;
    const userId = (req as any).user.id; 
    const skill = await skillService.createSkill(title, description, category, level, userId);
    res.status(201).json({ skill, message: 'Skill created successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMySkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const skills = await skillService.getUserSkills(userId);
    res.json({ skills });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllMarketSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await skillService.getAllSkills();
    res.json({ skills });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, category, level } = req.body;
    const skill = await skillService.updateSkill(id, { title, description, category, level });
    res.json({ skill, message: 'Skill updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await skillService.deleteSkill(id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
