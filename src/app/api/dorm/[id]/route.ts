import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15 compatibility where params can be a Promise
) {
    try {
        const { id } = await params; // Await params just in case (Next.js 15+)

        const dorm = await prisma.dorm.findUnique({
            where: { id },
        });

        if (!dorm) {
            return NextResponse.json({ error: 'Dorm not found' }, { status: 404 });
        }

        return NextResponse.json(dorm);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
