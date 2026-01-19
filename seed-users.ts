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


    const sqlFiles = [
        'insert_dorms.sql',
        'insert_dorm_records_1.sql',
        'insert_dorm_records_2.sql'
    ];

    console.log('🌱 Seeding SQL Files...');
    const path = require('path');
    const fs = require('fs');

    for (const file of sqlFiles) {
        const filePath = path.join(__dirname, 'database', file);
        if (fs.existsSync(filePath)) {
            console.log(`__ Executing ${file}...`);
            try {
                const sql = fs.readFileSync(filePath, 'utf-8');
                // Split by semicolon to handle multiple statements if necessary, 
                // but executeRawUnsafe might handle it depending on the driver. 
                // For simplicity and matching typical raw SQL dumps, we try executing the whole file.
                // If the file contains multiple statements, Postgres usually requires them to be executed separately 
                // or implicitly handles them. safer to just execute the whole string if it's a valid script.
                // However, Prisma's executeRawUnsafe usually executes a single statement.
                // If these files are large dumps with multiple INSERTs, we might need to split them.
                // Assuming they are standard SQL dumps.
                await prisma.$executeRawUnsafe(sql);
                console.log(`✅ Executed ${file}`);
            } catch (err: any) {
                console.error(`❌ Failed to execute ${file}:`, err.message);
            }
        } else {
            console.warn(`⚠️ File not found: ${filePath}`);
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
