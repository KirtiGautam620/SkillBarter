import { SkillEntity } from '@entities/SkillEntity';

export interface ISkillRepo {
  create(skill: SkillEntity): Promise<SkillEntity>;
  findByUserId(userId: string): Promise<SkillEntity[]>;
  findAll(): Promise<SkillEntity[]>;
  update(id: string, data: Partial<{ title: string; description: string; category: string; level: string }>): Promise<SkillEntity>;
  delete(id: string): Promise<void>;
}
