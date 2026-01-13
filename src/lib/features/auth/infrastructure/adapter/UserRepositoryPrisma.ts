import prisma from '@/lib/common/database/PrismaClient';
import { UserRepository } from '@/lib/features/auth/domain/port/UserRepository';
import { User } from '@/generated/prisma';

export class PrismaUserRepository implements UserRepository {
  async create(role: string, passwordHash: string, name?: string, email?: string): Promise<User> {
    return prisma.user.create({
      data: {
        role,
        passwordHash,
        name,
        email,
      },
    });
  }

  async findByRole(role: string): Promise<User | null> {
    if (!role || role.trim() === '') return null;
    return prisma.user.findFirst({
      where: {
        role: {
          equals: role,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email || email.trim() === '') return null;
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
