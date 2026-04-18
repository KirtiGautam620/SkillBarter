const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
    if (!john) {
      console.log('John not found');
      return;
    }

    const skills = await prisma.skill.findMany();
    console.log('Found', skills.length, 'skills');

    const otherUsers = await prisma.user.findMany({ where: { NOT: { id: john.id } } });
    if (otherUsers.length > 0) {
      for (let i = 0; i < Math.min(skills.length, 10); i++) {
        await prisma.skill.update({
          where: { id: skills[i].id },
          data: { userId: otherUsers[i % otherUsers.length].id }
        });
      }
      console.log('Reassigned skills successfully.');
    } else {
        console.log('No other users found to reassign skills to.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
