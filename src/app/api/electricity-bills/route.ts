import { NextRequest, NextResponse } from 'next/server';
import { ElectricityBillContainer } from '@/lib/features/electricity-bills/ElectricityBillContainer';
import { parseCreateElectricityBill } from '@/lib/features/electricity-bills/presentation/dto/CreateElectricityBillDto';
import { parseListElectricityBills } from '@/lib/features/electricity-bills/presentation/dto/ListElectricityBillsDto';
import { requireApiAuth } from '@/lib/server/auth/requireApiAuth';

const facilityRoles = ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'];
const facilityUsernames = ['Facility management'];

/**
 * @swagger
 * /api/electricity-bills:
 *   get:
 *     tags:
 *       - Electricity Bills
 *     summary: List semua tagihan listrik
 *     description: |
 *       Mendapatkan semua electricity bills dengan filter opsional.
 *       
 *       **PENTING:** Memerlukan autentikasi. Pastikan sudah login terlebih dahulu.
 *       
 *       **Hak Akses:** Hanya user dengan role 'Facility management' yang bisa mengakses endpoint ini
 *       
 *       **Filter yang tersedia:**
 *       - userId: Filter berdasarkan ID user
 *       - panelId: Filter berdasarkan ID panel
 *       - billingMonth: Filter berdasarkan bulan tagihan (format: YYYY-MM-DD)
 *       
 *       Semua filter bersifat opsional. Jika tidak ada filter, akan mengembalikan semua tagihan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Filter berdasarkan user ID
 *       - in: query
 *         name: panelId
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Filter berdasarkan panel ID
 *       - in: query
 *         name: billingMonth
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *         description: Filter berdasarkan bulan tagihan (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daftar tagihan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ElectricityBill'
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
 *   post:
 *     summary: Buat tagihan listrik baru
 *     description: Membuat tagihan listrik baru dengan data yang diberikan
 *     tags: [Electricity Bills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateElectricityBillRequest'
 *     responses:
 *       201:
 *         description: Tagihan berhasil dibuat
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const { searchParams } = new URL(req.url);
    const filters: any = {};

    if (searchParams.get('userId')) {
      filters.userId = parseInt(searchParams.get('userId')!, 10);
    }
    if (searchParams.get('panelId')) {
      filters.panelId = parseInt(searchParams.get('panelId')!, 10);
    }
    if (searchParams.get('billingMonth')) {
      filters.billingMonth = new Date(searchParams.get('billingMonth')!);
    }

    const container = ElectricityBillContainer.getInstance();
    const bills = await container.listBillsUseCase.execute(Object.keys(filters).length > 0 ? filters : undefined);

    return NextResponse.json(bills);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

/**
 * @swagger
 * /api/electricity-bills:
 *   post:
 *     tags:
 *       - Electricity Bills
 *     summary: Buat tagihan listrik baru
 *     description: |
 *       Membuat electricity bill baru.
 *       
 *       **PENTING:**
 *       - Pastikan sudah login terlebih dahulu untuk mendapatkan accessToken
 *       - Pastikan panelId dan userId sudah ada di database
 *       - Field statusPay tidak perlu dikirim karena akan otomatis di-set menjadi 'Belum Lunas' oleh database
 *       - Format billingMonth: YYYY-MM-DD
 *       - kwhUse dan totalBills menggunakan tipe decimal/float
 *       
 *       **Hak Akses:** Hanya user dengan role 'Facility management' yang bisa mengakses endpoint ini
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateElectricityBillRequest'
 *           example:
 *             panelId: 1
 *             userId: 1
 *             billingMonth: "2024-01-01"
 *             kwhUse: 1500.50
 *             totalBills: 2500000.00
 *             vaStatus: ""
 *     responses:
 *       201:
 *         description: Tagihan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElectricityBill'
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
    const auth = await requireApiAuth(req, {
      allowedRoles: facilityRoles,
      allowedUsernames: facilityUsernames,
    });
    if ('response' in auth) return auth.response;

    const body = await req.json();
    const data = parseCreateElectricityBill(body);

    const container = ElectricityBillContainer.getInstance();
    const billingMonth = data.billingMonth instanceof Date ? data.billingMonth : new Date(data.billingMonth);
    
    const bill = await container.createBillUseCase.execute({
      panelId: data.panelId,
      userId: data.userId,
      billingMonth,
      kwhUse: data.kwhUse,
      vaStatus: data.vaStatus,
      totalBills: data.totalBills,
      statusPay: data.statusPay,
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

