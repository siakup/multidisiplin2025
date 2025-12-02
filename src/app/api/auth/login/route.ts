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
 *       Login dengan email atau username dan password. Field 'email' bisa berisi email atau username.
 *       Mengembalikan accessToken dan refreshToken yang harus disimpan untuk autentikasi endpoint lainnya.
 *       
 *       **Contoh username:** `{"email": "Facility management", "password": "1234"}`
 *       
 *       **Contoh email:** `{"email": "user@example.com", "password": "123456"}`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             withUsername:
 *               summary: Login dengan username
 *               value:
 *                 email: "Facility management"
 *                 password: "1234"
 *             withEmail:
 *               summary: Login dengan email
 *               value:
 *                 email: "user@example.com"
 *                 password: "123456"
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

    const { email, password } = parseLogin(body);

    const container = AuthContainer.getInstance();
    const result = await container.loginUseCase.execute({ email, password });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
