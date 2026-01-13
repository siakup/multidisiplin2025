import prisma from './src/lib/common/database/PrismaClient';

async function main() {
    try {
        const users = await (prisma as any).user.findMany();
        console.log(`FOUND ${users.length} USERS`);
        users.forEach((u: any) => {
            console.log(`ID: ${u.id || u.id_User}, ROLE: "${u.role}", PASS: "${u.passwordHash ? u.passwordHash.substring(0, 10) : 'NULL'}...", NAME: "${u.name}", EMAIL: "${u.email}"`);
        });
    } catch (err: any) {
        console.error('Error fetching users:', err.message);
    }
}

main().catch(console.error).finally(() => (prisma as any).$disconnect());
