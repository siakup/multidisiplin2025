import { NextRequest, NextResponse } from 'next/server';
import { parseLogin } from '@/lib/features/auth/presentation/dto/LoginRequestDto';
import { AuthContainer } from '@/lib/features/auth/AuthContainer';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: |
 *       Login dengan Role dan Password.
 *       Mengembalikan accessToken dan refreshToken yang harus disimpan untuk autentikasi endpoint lainnya.
 *       
 *       **Role yang tersedia:**
 *       - Facility management (Password: 1234)
 *       - Student Housing (Password: 1234)
 *       
 *       **Contoh:** `{"role": "Facility management", "password": "1234"}`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             facilityManagement:
 *               summary: Login sebagai Facility Management
 *               value:
 *                 role: "Facility management"
 *                 password: "1234"
 *             studentHousing:
 *               summary: Login sebagai Student Housing
 *               value:
 *                 role: "Student Housing"
 *                 password: "1234"
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - kredensial salah
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

    const { role, password } = parseLogin(body);

    const container = AuthContainer.getInstance();
    const result = await container.loginUseCase.execute({ role, password });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
