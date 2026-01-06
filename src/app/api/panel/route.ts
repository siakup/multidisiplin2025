import { NextRequest, NextResponse } from 'next/server';
import { PanelContainer } from '@/lib/features/panel/PanelContainer';
import { parseCreatePanel } from '@/lib/features/panel/presentation/dto/CreatePanelDto';

/**
 * @swagger
 * /api/panel:
 *   get:
 *     tags:
 *       - Panel
 *     summary: List semua panel
 *     description: |
 *       Mengambil daftar semua panel yang tersedia di database.
 *       
 *       Endpoint ini digunakan untuk menampilkan dropdown panel saat input/edit tagihan listrik.
 *     responses:
 *       200:
 *         description: Daftar panel berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Panel'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
  try {
    const container = PanelContainer.getInstance();
    const panels = await container.listPanelsUseCase.execute();

    return NextResponse.json(panels);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

/**
 * @swagger
 * /api/panel:
 *   post:
 *     tags:
 *       - Panel
 *     summary: Buat panel baru
 *     description: |
 *       Membuat panel baru dengan nama panel.
 *       
 *       **Alur Penggunaan:**
 *       - User menambah panel baru saat input tagihan listrik
 *       - Panel akan tersimpan permanen di database
 *       - Panel yang sudah tersimpan dapat dipilih untuk tagihan berikutnya
 *       - Panel TIDAK dapat diedit atau dihapus setelah dibuat
 *       
 *       **Catatan:** Panel yang dibuat akan tersimpan dengan timestamp createdAt dan updatedAt.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePanelRequest'
 *           example:
 *             namePanel: "Test Panel 01"
 *     responses:
 *       201:
 *         description: Panel berhasil dibuat
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namePanel } = parseCreatePanel(body);

    const container = PanelContainer.getInstance();
    const panel = await container.createPanelUseCase.execute(namePanel);

    return NextResponse.json(panel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

