import { NextRequest, NextResponse } from 'next/server';
import { parseRegister } from '@/lib/features/auth/presentation/dto/RegisterRequestDto';
import { AuthContainer } from '@/lib/features/auth/AuthContainer';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register user baru
 *     description: |
 *       Register user baru. Email atau username harus diisi (salah satu atau keduanya).
 *       
 *       **Contoh dengan email:**
 *       `{"email": "test@example.com", "password": "123456", "name": "Test User"}`
 *       
 *       **Contoh dengan username:**
 *       `{"username": "testuser", "password": "123456", "name": "Test User"}`
 *       
 *       **Contoh dengan keduanya:**
 *       `{"email": "test@example.com", "username": "testuser", "password": "123456", "name": "Test User"}`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             withEmail:
 *               summary: Register dengan email
 *               value:
 *                 email: "test@example.com"
 *                 password: "123456"
 *                 name: "Test User"
 *             withUsername:
 *               summary: Register dengan username
 *               value:
 *                 username: "testuser"
 *                 password: "123456"
 *                 name: "Test User"
 *             withBoth:
 *               summary: Register dengan email dan username
 *               value:
 *                 email: "test@example.com"
 *                 username: "testuser"
 *                 password: "123456"
 *                 name: "Test User"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - data tidak valid atau email/username sudah terdaftar
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
    const { email, role, password, name } = parseRegister(body);

    const container = AuthContainer.getInstance();
    const result = await container.registerUseCase.execute({ email, role, password, name });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
