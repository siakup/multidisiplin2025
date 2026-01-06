import { PrismaClient } from '../src/generated/prisma';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}

async function main() {
    console.log('Seeding database...');

    // Create Users
    const users = [
        {
            role: 'Facility management',
            passwordHash: hashPassword('1234'),
        },
        {
            role: 'Student Housing',
            passwordHash: hashPassword('1234'),
        },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { role: user.role },
            update: { passwordHash: user.passwordHash },
            create: {
                role: user.role,
                passwordHash: user.passwordHash,
            },
        });
    }

    // Create some Panels for Student Housing
    const panels = [
        { namePanel: 'Panel Asrama Putra 1', category: 'STUDENT_HOUSING' as any },
        { namePanel: 'Panel Asrama Putri 1', category: 'STUDENT_HOUSING' as any },
        { namePanel: 'Panel Central FM', category: 'FACILITY_MANAGEMENT' as any },
    ];

    for (const panel of panels) {
        await prisma.panel.upsert({
            where: { namePanel: panel.namePanel },
            update: { category: panel.category },
            create: {
                namePanel: panel.namePanel,
                category: panel.category,
            },
        });
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
