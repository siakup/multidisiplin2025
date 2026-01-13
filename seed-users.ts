import prisma from './src/lib/common/database/PrismaClient';
import { createHash } from 'crypto';
// import { PanelCategory } from '@prisma/client'; 

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

async function main() {
    const users = [
        { role: 'Facility Management', password: '1234' },
        { role: 'Student Housing', password: '1234' }
    ];

    console.log('🌱 Seeding Users...');
    for (const u of users) {
        const hash = sha256(u.password);
        try {
            await prisma.user.upsert({
                where: { role: u.role },
                update: { passwordHash: hash },
                create: {
                    role: u.role,
                    passwordHash: hash,
                    name: u.role
                }
            });
            console.log(`✅ User synced: ${u.role}`);
        } catch (err: any) {
            console.error(`❌ Failed to seed user ${u.role}:`, err.message);
        }
    }

    const panels = [
        { name: 'GL 01', category: 'FACILITY_MANAGEMENT' },
        { name: 'GL 02', category: 'FACILITY_MANAGEMENT' },
        { name: 'GOR 01', category: 'FACILITY_MANAGEMENT' },
        { name: 'GOR 02', category: 'FACILITY_MANAGEMENT' },
        { name: 'Modular 01', category: 'FACILITY_MANAGEMENT' },
    ];

    console.log('🌱 Seeding Panels...');
    for (const p of panels) {
        try {
            await prisma.panel.upsert({
                where: { namePanel: p.name },
                update: { category: p.category as any },
                create: {
                    namePanel: p.name,
                    category: p.category as any
                }
            });
            console.log(`✅ Panel synced: ${p.name}`);
        } catch (err: any) {
            console.error(`❌ Failed to seed panel ${p.name}:`, err.message);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await (prisma as any).$disconnect();
    });
