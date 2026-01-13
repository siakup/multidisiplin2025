import { User } from '@/generated/prisma';

// Port: abstraction for user persistence
export interface UserRepository {
  create(role: string, passwordHash: string, name?: string, email?: string): Promise<User>;

  findByRole(role: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: number): Promise<User | null>;
}
