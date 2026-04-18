import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const skills = await prisma.skill.findMany({
      include: { user: true }
    });
    console.log('MARKET_DATA_START');
    console.log(JSON.stringify(skills));
    console.log('MARKET_DATA_END');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
