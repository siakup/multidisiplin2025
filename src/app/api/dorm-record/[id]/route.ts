import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

/**
 * @swagger
 * /api/dorm-record/{id}:
 *   delete:
 *     tags:
 *       - Dorm Record
 *     summary: Delete a dorm record
 *     description: Delete a specific dorm electricity record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await requireApiAuth(req, {
        allowedRoles: ['Student Housing', 'student housing']
    });

    if (authResult instanceof NextResponse) return authResult;

    try {
        const { id } = params;

        const existingRecord = await prisma.dormRecord.findUnique({
            where: { id }
        });

        if (!existingRecord) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        await prisma.dormRecord.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
