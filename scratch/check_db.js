const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const skills = await prisma.skill.count();
  const swaps = await prisma.swapRequest.count();
  
  console.log('Database Summary:');
  console.log(' - Users:', users);
  console.log(' - Skills:', skills);
  console.log(' - Swaps:', swaps);

  if (skills > 0) {
    const list = await prisma.skill.findMany({ take: 5, include: { user: true } });
    console.log('\nSample Skills:');
    list.forEach(s => console.log(` - [${s.id}] ${s.title} by ${s.user.email}`));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
