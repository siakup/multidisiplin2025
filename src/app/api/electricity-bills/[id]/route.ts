import { NextRequest, NextResponse } from 'next/server';
import { ElectricityBillContainer } from '@/lib/features/electricity-bills/ElectricityBillContainer';
import { parseUpdateElectricityBill } from '@/lib/features/electricity-bills/presentation/dto/UpdateElectricityBillDto';

/**
 * @swagger
 * /api/electricity-bills/{id}:
 *   get:
 *     summary: Get tagihan listrik by ID
 *     description: Mendapatkan detail tagihan listrik berdasarkan ID
 *     tags:
 *       - Electricity Bills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID tagihan listrik
 *     responses:
 *       200:
 *         description: Detail tagihan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElectricityBill'
 *       400:
 *         description: ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tagihan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
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
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const container = ElectricityBillContainer.getInstance();
    const bill = await container.getBillUseCase.execute(billId);

    return NextResponse.json(bill);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

/**
 * @swagger
 * /api/electricity-bills/{id}:
 *   put:
 *     summary: Update tagihan listrik
 *     description: |
 *       Update electricity bill berdasarkan ID.
 *       
 *       **Catatan:** Hanya field yang dikirim akan di-update. Field lain akan tetap.
 *       
 *       **Field yang bisa diupdate:**
 *       - kwhUse: Penggunaan kWh
 *       - totalBills: Total tagihan
 *       - statusPay: Status pembayaran ("Lunas" atau "Belum Lunas")
 *       - vaStatus: Status VA
 *       - panelId: ID panel
 *       - userId: ID user
 *       - billingMonth: Bulan tagihan
 *     tags:
 *       - Electricity Bills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID tagihan listrik
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateElectricityBillRequest'
 *           example:
 *             kwhUse: 2000.00
 *             totalBills: 3000000.00
 *             statusPay: "Lunas"
 *             vaStatus: "Inactive"
 *     responses:
 *       200:
 *         description: Tagihan berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElectricityBill'
 *       400:
 *         description: Request tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tagihan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
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
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const body = await req.json();
    const updateData = parseUpdateElectricityBill(body);

    // Convert billingMonth to Date if it's a string
    const processedData = {
      ...updateData,
      billingMonth: updateData.billingMonth
        ? updateData.billingMonth instanceof Date
          ? updateData.billingMonth
          : new Date(updateData.billingMonth)
        : undefined,
    };

    const container = ElectricityBillContainer.getInstance();
    const bill = await container.updateBillUseCase.execute(billId, processedData);

    return NextResponse.json(bill);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

/**
 * @swagger
 * /api/electricity-bills/{id}:
 *   delete:
 *     summary: Hapus tagihan listrik
 *     description: Menghapus tagihan listrik berdasarkan ID
 *     tags:
 *       - Electricity Bills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID tagihan listrik
 *     responses:
 *       200:
 *         description: Tagihan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tagihan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
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
    const billId = parseInt(id, 10);

    if (isNaN(billId)) {
      return NextResponse.json({ error: 'Invalid bill ID' }, { status: 400 });
    }

    const container = ElectricityBillContainer.getInstance();
    await container.deleteBillUseCase.execute(billId);

    return NextResponse.json({ message: 'Electricity bill deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}