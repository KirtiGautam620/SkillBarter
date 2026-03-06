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
//# sourceMappingURL=seed.js.map