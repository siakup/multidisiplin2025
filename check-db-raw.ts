import prisma from './src/lib/common/database/PrismaClient';

async function main() {
    try {
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `;
        console.log('COLUMNS:', JSON.stringify(columns));

        const users = await prisma.$queryRaw`SELECT * FROM "User"`;
        console.log('USERS:', JSON.stringify(users));
    } catch (err: any) {
        console.error('ERROR:', err.message);
    }
}

main().catch(console.error).finally(() => (prisma as any).$disconnect());
