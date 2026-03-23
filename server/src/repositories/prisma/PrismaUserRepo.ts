import { PrismaClient, User } from '@prisma/client';
import { UserEntity } from '@entities/UserEntity';
import { IUserRepo } from '../interfaces/IUserRepo';

export class PrismaUserRepo implements IUserRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? new UserEntity(user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? new UserEntity(user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const newUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        bio: user.bio ?? null,
        avatar: user.avatar ?? null,
        rating: user.rating,
        reviewCount: user.reviewCount,
      }
    });
    return new UserEntity(newUser.id, newUser.name, newUser.email, newUser.password, newUser.createdAt, newUser.updatedAt);
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return new UserEntity(updatedUser.id, updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.createdAt, updatedUser.updatedAt);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}

