import { NextRequest, NextResponse } from 'next/server';
import { PanelContainer } from '@/lib/features/panel/PanelContainer';

/**
 * @swagger
 * /api/panel/{id}:
 *   get:
 *     tags:
 *       - Panel
 *     summary: Get panel by ID
 *     description: Mengambil detail panel berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panel
 *     responses:
 *       200:
 *         description: Detail panel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Panel'
 *       400:
 *         description: Bad request - ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Panel tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const panelId = parseInt(id, 10);

    if (isNaN(panelId)) {
      return NextResponse.json({ error: 'Invalid panel ID' }, { status: 400 });
    }

    const container = PanelContainer.getInstance();
    const panel = await container.getPanelUseCase.execute(panelId);

    return NextResponse.json(panel);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
