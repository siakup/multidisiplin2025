import prisma from '@/lib/common/database/PrismaClient';
import { UserRepository } from '@/lib/features/auth/domain/port/UserRepository';
import { User } from '@/generated/prisma';

export class PrismaUserRepository implements UserRepository {
  async create(email: string, passwordHash: string, name?: string, username?: string): Promise<User> {
    // Jika email kosong, set null (email optional)
    const finalEmail = email && email.trim() !== '' ? email : null;
    
    // Generate username jika tidak ada
    let finalUsername = username;
    if (!finalUsername) {
      if (finalEmail) {
        finalUsername = finalEmail.split('@')[0];
      } else {
        // Jika tidak ada email dan username, generate random
        finalUsername = `user_${Date.now()}`;
      }
    }
    
    return prisma.user.create({ 
      data: { 
        email: finalEmail, 
        passwordHash, 
        name, 
        username: finalUsername 
      } 
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email || email.trim() === '') return null;
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    if (!username || username.trim() === '') return null;
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
