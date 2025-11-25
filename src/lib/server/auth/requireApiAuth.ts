import { NextRequest, NextResponse } from 'next/server';
import { JwtTokenService } from '@/lib/features/auth/infrastructure/adapter/TokenServiceJwt';
import prisma from '@/lib/common/database/PrismaClient';
import {
  isRoleAllowed,
  isUsernameAllowed,
} from '@/lib/common/utils/identity';
import { logger } from '@/lib/common/logger/logger';

interface RequireApiAuthOptions {
  allowedRoles?: string[];
  allowedUsernames?: string[];
}

type GuardFailure = { response: NextResponse };
type GuardSuccess = {
  user: {
    id: number;
    role: string;
    username: string | null;
  };
};

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const forbidden = () => NextResponse.json({ error: 'Forbidden' }, { status: 403 });

export async function requireApiAuth(
  req: NextRequest,
  options: RequireApiAuthOptions = {}
): Promise<GuardFailure | GuardSuccess> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return { response: unauthorized() };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return { response: unauthorized() };
  }

  try {
    const tokenService = new JwtTokenService();
    const payload = tokenService.verify<{ userId: number }>(token);

    if (!payload?.userId) {
      return { response: unauthorized() };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        username: true,
      },
    });

    if (!user) {
      return { response: unauthorized() };
    }

    const roleAllowed = isRoleAllowed(user.role, options.allowedRoles);
    const usernameAllowed = isUsernameAllowed(user.username, options.allowedUsernames);

    if (!roleAllowed && !usernameAllowed) {
      return { response: forbidden() };
    }

    return { user };
  } catch (error) {
    logger.error('Auth verification failed:', error as Error);
    return { response: unauthorized() };
  }
}


