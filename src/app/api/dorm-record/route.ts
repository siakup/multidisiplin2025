import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

/**
 * @swagger
 * /api/dorm-record:
 *   get:
 *     tags:
 *       - Dorm Record
 *     summary: Get all dorm records
 *     description: Retrieve list of all dorm electricity records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of dorm records
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await requireApiAuth(req, {
    allowedRoles: ['Student Housing', 'student housing']
  });
  
  if (authResult instanceof NextResponse) return authResult;

  try {
    const records = await prisma.dormRecord.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/dorm-record:
 *   post:
 *     tags:
 *       - Dorm Record
 *     summary: Create new dorm record
 *     description: Add a new dorm electricity consumption record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - period
 *               - dormName
 *               - totalKwh
 *               - billAmount
 *             properties:
 *               period:
 *                 type: string
 *                 example: "Januari 2025"
 *               dormName:
 *                 type: string
 *                 example: "Asrama Putra 1"
 *               totalKwh:
 *                 type: number
 *                 example: 1500
 *               billAmount:
 *                 type: number
 *                 example: 2500000
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const authResult = await requireApiAuth(req, {
    allowedRoles: ['Student Housing', 'student housing']
  });
  
  if (authResult instanceof NextResponse) return authResult;
  if (!('user' in authResult)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { period, dormName, totalKwh, billAmount } = body;

    if (!period || !dormName || totalKwh === undefined || billAmount === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Parse period string (format: "Januari 2025")
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const [monthName, yearStr] = period.split(' ');
    const monthIndex = monthNames.indexOf(monthName);
    const year = parseInt(yearStr);
    
    if (monthIndex === -1 || isNaN(year)) {
      return NextResponse.json(
        { error: 'Invalid period format. Use "Januari 2025" format' },
        { status: 400 }
      );
    }

    const periodDate = new Date(year, monthIndex, 1);

    const record = await prisma.dormRecord.create({
      data: {
        period: periodDate,
        dormName,
        totalKwh: Number(totalKwh),
        billAmount: Number(billAmount),
        createdBy: authResult.user.id
      }
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
