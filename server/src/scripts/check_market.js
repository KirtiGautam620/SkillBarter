const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
