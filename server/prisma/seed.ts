import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      id: 'user1-id',
      name: 'User One',
      email: 'user1@example.com',
      password: hashedPassword,
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      id: 'user2-id',
      name: 'User Two',
      email: 'user2@example.com',
      password: hashedPassword,
    }
  });

  // Create skills
  await prisma.skill.createMany({
    data: [
      {
        id: 'skill1-id',
        title: 'JavaScript',
        description: 'Teach JS',
        category: 'Programming',
        level: 'Intermediate',
        userId: user1.id,
      },
      {
        id: 'skill2-id',
        title: 'React',
        description: 'Teach React',
        category: 'Frontend',
        level: 'Advanced',
        userId: user2.id,
      },
    ],
  });

  console.log('Seeding completed');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

