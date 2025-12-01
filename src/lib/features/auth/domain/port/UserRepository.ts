import { User } from '@/generated/prisma';

// Port: abstraction for user persistence
export interface UserRepository {
  create(email: string, passwordHash: string, name?: string, username?: string): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findById(id: number): Promise<User | null>;
}
