import { NextRequest, NextResponse } from 'next/server';
import { PanelContainer } from '@/lib/features/panel/PanelContainer';
import { parseUpdatePanel } from '@/lib/features/panel/presentation/dto/UpdatePanelDto';

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

/**
 * @swagger
 * /api/panel/{id}:
 *   put:
 *     tags:
 *       - Panel
 *     summary: Update panel
 *     description: Mengupdate data panel berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePanelRequest'
 *     responses:
 *       200:
 *         description: Panel berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Panel'
 *       400:
 *         description: Bad request - data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - token tidak valid
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
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const panelId = parseInt(id, 10);

    if (isNaN(panelId)) {
      return NextResponse.json({ error: 'Invalid panel ID' }, { status: 400 });
    }

    const body = await req.json();
    const updateData = parseUpdatePanel(body);

    if (!updateData.namePanel) {
      return NextResponse.json({ error: 'Name Panel is required' }, { status: 400 });
    }

    const container = PanelContainer.getInstance();
    const panel = await container.updatePanelUseCase.execute(panelId, updateData.namePanel);

    return NextResponse.json(panel);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

/**
 * @swagger
 * /api/panel/{id}:
 *   delete:
 *     tags:
 *       - Panel
 *     summary: Delete panel
 *     description: Menghapus panel berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID panel
 *     responses:
 *       200:
 *         description: Panel berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Bad request - ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - token tidak valid
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
export async function DELETE(
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
    await container.deletePanelUseCase.execute(panelId);

    return NextResponse.json({ message: 'Panel deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

