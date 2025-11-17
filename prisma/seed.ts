// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: 'hashedpassword',
      name: 'Admin',
      role: 'ADMIN',
    },
  });
}

main().finally(() => prisma.$disconnect());
