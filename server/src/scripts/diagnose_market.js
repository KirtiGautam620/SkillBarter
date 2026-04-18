const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    console.log('--- ALL USERS ---');
    console.table(users);

    const skills = await prisma.skill.findMany({
      include: { user: true }
    });
    console.log('\n--- ALL SKILLS ---');
    if (skills.length === 0) {
      console.log('No skills found in database.');
    } else {
      console.table(skills.map(s => ({
        id: s.id,
        title: s.title,
        owner: s.user.email,
        ownerId: s.userId,
        isActive: s.isActive
      })));
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
