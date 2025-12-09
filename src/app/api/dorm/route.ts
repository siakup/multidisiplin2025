import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/common/database/PrismaClient';

/**
 * @swagger
 * /api/dorm:
 *   get:
 *     tags:
 *       - Dorm
 *     summary: Get all dorms
 *     description: Retrieve list of all dorms
 *     responses:
 *       200:
 *         description: List of dorms
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const dorms = await prisma.dorm.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(dorms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/dorm:
 *   post:
 *     tags:
 *       - Dorm
 *     summary: Create new dorm
 *     description: Add a new dorm to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - powerCapacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Asrama Putra 1"
 *               gender:
 *                 type: string
 *                 enum: [PUTRA, PUTRI, CAMPUR]
 *                 example: "PUTRA"
 *               powerCapacity:
 *                 type: integer
 *                 example: 2200
 *               capacity:
 *                 type: integer
 *                 example: 24
 *     responses:
 *       201:
 *         description: Dorm created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, powerCapacity, capacity } = body;

    if (!name || !gender || !powerCapacity) {
      return NextResponse.json(
        { error: 'Name, gender, and powerCapacity are required' },
        { status: 400 }
      );
    }

    const dorm = await prisma.dorm.create({
      data: {
        name,
        gender,
        powerCapacity: Number(powerCapacity),
        capacity: capacity ? Number(capacity) : null
      }
    });

    return NextResponse.json(dorm, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Dorm with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
