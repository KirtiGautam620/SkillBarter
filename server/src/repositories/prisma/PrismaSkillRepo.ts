import { PrismaClient } from '@prisma/client';
import { SkillEntity } from '@entities/SkillEntity';
import { ISkillRepo } from '../interfaces/ISkillRepo';

export class PrismaSkillRepo implements ISkillRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(skill: SkillEntity): Promise<SkillEntity> {
    const newSkill = await this.prisma.skill.create({
      data: {
        id: skill.id,
        title: skill.title,
        description: skill.description,
        category: skill.category,
        level: skill.level,
        isActive: skill.isActive,
        userId: skill.userId,
      }
    });
    return new SkillEntity(newSkill.id, newSkill.title, newSkill.description, newSkill.category, newSkill.userId, newSkill.createdAt, newSkill.updatedAt);
  }

  async findByUserId(userId: string): Promise<SkillEntity[]> {
    const skills = await this.prisma.skill.findMany({ where: { userId } });
    return skills.map(s => new SkillEntity(s.id, s.title, s.description, s.category, s.userId, s.createdAt, s.updatedAt));
  }

  async findAll(): Promise<SkillEntity[]> {
    const skills = await this.prisma.skill.findMany({ 
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            rating: true
          }
        } 
      } 
    });
    return skills.map(s => {
      const entity = new SkillEntity(s.id, s.title, s.description, s.category, s.userId, s.createdAt, s.updatedAt);
      (entity as any).user = s.user; // Attach for the frontend
      return entity;
    });
  }

  async update(id: string, data: Partial<{ title: string; description: string; category: string; level: string }>): Promise<SkillEntity> {
    const updated = await this.prisma.skill.update({ where: { id }, data });
    return new SkillEntity(updated.id, updated.title, updated.description, updated.category, updated.userId, updated.createdAt, updated.updatedAt);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.skill.delete({ where: { id } });
  }
}
