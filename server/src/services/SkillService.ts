import crypto from 'crypto';
import { SkillEntity } from '@entities/SkillEntity';
import { ISkillRepo } from '@repositories/interfaces/ISkillRepo';

export class SkillService {
  private skillRepo: ISkillRepo;

  constructor(skillRepo: ISkillRepo) {
    this.skillRepo = skillRepo;
  }

  async createSkill(title: string, description: string, category: string, level: string, userId: string): Promise<SkillEntity> {
    const id = crypto.randomUUID();
    const skill = new SkillEntity(id, title, description, category, userId);
    skill.level = level || 'Beginner';
    return await this.skillRepo.create(skill);
  }

  async getUserSkills(userId: string): Promise<SkillEntity[]> {
    return await this.skillRepo.findByUserId(userId);
  }

  async getAllSkills(): Promise<SkillEntity[]> {
    return await this.skillRepo.findAll();
  }

  async updateSkill(id: string, data: Partial<{ title: string; description: string; category: string; level: string }>): Promise<SkillEntity> {
    return await this.skillRepo.update(id, data);
  }

  async deleteSkill(id: string): Promise<void> {
    return await this.skillRepo.delete(id);
  }
}
