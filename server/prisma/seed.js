"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash('password', 10);
    // Create users
    const users = [
        { id: 'user1-id', name: 'Alice Johnson', email: 'alice@example.com' },
        { id: 'user2-id', name: 'Bob Smith', email: 'bob@example.com' },
        { id: 'user3-id', name: 'Charlie Davis', email: 'charlie@example.com' },
        { id: 'user4-id', name: 'Diana Prince', email: 'diana@example.com' },
    ];
    const createdUsers = [];
    for (const user of users) {
        const u = await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: hashedPassword,
                bio: `Hi, I am ${user.name}. I love swapping skills!`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
            }
        });
        createdUsers.push(u);
    }
    // Create skills
    const skills = [
        { id: 'skill1-id', title: 'JavaScript', description: 'Web development with JS', category: 'Programming', level: 'Advanced', userId: 'user1-id' },
        { id: 'skill2-id', title: 'React', description: 'Building UI with React', category: 'Frontend', level: 'Intermediate', userId: 'user2-id' },
        { id: 'skill3-id', title: 'Python', description: 'Data science and scripting', category: 'Programming', level: 'Beginner', userId: 'user3-id' },
        { id: 'skill4-id', title: 'UI/UX Design', description: 'Designing beautiful interfaces', category: 'Design', level: 'Advanced', userId: 'user4-id' },
        { id: 'skill5-id', title: 'Node.js', description: 'Backend development', category: 'Programming', level: 'Intermediate', userId: 'user1-id' },
    ];
    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { id: skill.id },
            update: {},
            create: skill
        });
    }
    // Create Time Credit Accounts
    for (const user of createdUsers) {
        await prisma.timeCreditAccount.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                balance: 10,
            }
        });
    }
    console.log('Seeding completed successfully');
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seed.js.map