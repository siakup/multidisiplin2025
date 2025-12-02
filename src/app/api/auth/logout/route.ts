// logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthContainer } from '@/lib/features/auth/AuthContainer';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: |
 *       Logout user dan invalidate refresh token.
 *       
 *       **PENTING:** Gunakan refresh token (bukan access token) di Authorization header.
 *       
 *       Format: `Bearer <refresh_token>`
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 });
    }
    const refreshToken = authHeader.split(' ')[1];

    const container = AuthContainer.getInstance();
    await container.logoutUseCase.execute({ refreshToken });

    return NextResponse.json({ message: 'Logged out' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
