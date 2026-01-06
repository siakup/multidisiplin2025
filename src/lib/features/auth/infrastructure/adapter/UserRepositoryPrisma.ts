import prisma from '@/lib/common/database/PrismaClient';
import { UserRepository } from '@/lib/features/auth/domain/port/UserRepository';
import { User } from '@/generated/prisma';

export class PrismaUserRepository implements UserRepository {
  async create(email: string, passwordHash: string, name?: string, username?: string): Promise<User> {
    // Role-based system: tidak menggunakan email, username, name
    // Method ini tetap ada untuk backward compatibility tapi tidak digunakan
    throw new Error('Use role-based authentication. This method is deprecated.');
  }

  async findByEmail(email: string): Promise<User | null> {
    // Deprecated: sistem sekarang menggunakan role
    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    // Deprecated: sistem sekarang menggunakan role
    return null;
  }

  async findByRole(role: string): Promise<User | null> {
    if (!role || role.trim() === '') return null;
    return prisma.user.findUnique({ where: { role } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
