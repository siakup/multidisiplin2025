import prisma from '@/lib/common/database/PrismaClient';
import { SessionRepository } from '@/lib/features/auth/domain/port/SessionRepository';
import { Session } from '@/generated/prisma';

export class PrismaSessionRepository implements SessionRepository {
  async create(userId: number, refreshToken: string, expiresAt: Date): Promise<Session> {
    return prisma.session.create({ data: { userId, refreshToken, expiresAt } });
  }

  async findByRefreshToken(token: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { refreshToken: token } });
  }

  async revokeByToken(refreshToken: string): Promise<void> {
    // Use deleteMany to avoid error if session doesn't exist
    await prisma.session.deleteMany({ where: { refreshToken } });
  }
}
