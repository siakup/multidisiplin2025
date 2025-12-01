import { User as PrismaUser } from '@/generated/prisma';

export function toPublicUser(u: PrismaUser) {
  return {
    id: u.id,
    email: u.email || null,
    username: u.username || null,
    name: u.name || null,
    role: u.role,
    createdAt: u.createdAt,
  };
}
