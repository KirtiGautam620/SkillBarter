const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting market fix...');
  try {
    const userCount = await prisma.user.count();
    console.log('Total users:', userCount);
    
    const skillCount = await prisma.skill.count();
    console.log('Total skills before update:', skillCount);
    
    // Set all skills to active
    const updateResult = await prisma.skill.updateMany({
      data: { isActive: true }
    });
    console.log('Skills set to active:', updateResult.count);
    
    // Check if skills belong to different users
    const skills = await prisma.skill.findMany({
      include: { user: true },
      take: 5
    });
    
    if (skills.length > 0) {
      console.log('Sample skills owners:');
      skills.forEach(s => console.log(`- Skill: ${s.title}, Owner: ${s.user?.email || 'Unknown'}`));
    }
  } catch (err) {
    console.error('Error during market fix:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
