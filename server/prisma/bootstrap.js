const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Create a "Mentor" user to host skills
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@skillbarter.com' },
    update: {},
    create: {
      name: 'Master Mentor',
      email: 'mentor@skillbarter.com',
      password: hashedPassword,
      bio: 'Professional educator and full-stack developer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor',
    }
  });

  // 2. Create various skills
  const skillsData = [
    { title: 'Advanced React Patterns', category: 'Coding', level: 'Advanced', description: 'Learn hooks, context API, and performance optimization.' },
    { title: 'UI Design with Figma', category: 'Design', level: 'Intermediate', description: 'Create beautiful prototypes and design systems.' },
    { title: 'Spanish Conversation', category: 'Languages', level: 'Beginner', description: 'Practice basic speaking and listening skills.' },
    { title: 'Digital Photography', category: 'Photography', level: 'Intermediate', description: 'Master lighting and composition for your shots.' },
    { title: 'Public Speaking', category: 'Soft Skills', level: 'Intermediate', description: 'Overcome fear and deliver powerful presentations.' },
    { title: 'Node.js Backend Architecture', category: 'Coding', level: 'Advanced', description: 'Learn clean architecture and scalable systems.' },
    { title: 'Data Analysis with Python', category: 'Data Science', level: 'Beginner', description: 'Introduction to NumPy and Pandas.' },
    { title: 'Yoga for Stress Relief', category: 'Lifestyle', level: 'Beginner', description: 'Simple techniques to relax and stay flexible.' }
  ];

  for (const s of skillsData) {
    await prisma.skill.create({
      data: {
        ...s,
        userId: mentor.id,
      }
    });
  }

  // 3. Ensure mentor has a time credit account
  await prisma.timeCreditAccount.upsert({
    where: { userId: mentor.id },
    update: {},
    create: {
      userId: mentor.id,
      balance: 10,
    }
  });

  console.log('✅ Bootstrap completed: 8 skills added for mentor@skillbarter.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
