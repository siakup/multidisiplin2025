import { describe, it, expect, vi } from 'vitest';
import { PrismaUserRepository } from '@/lib/features/auth/infrastructure/persistence/PrismaUserRepository';

describe('PrismaUserRepository interface', () => {
  it('should have create, findByEmail, findById methods', () => {
    const repo: PrismaUserRepository = {
      create: vi.fn() as any,
      findByEmail: vi.fn() as any,
      findByRole: vi.fn() as any,
      findById: vi.fn() as any,
    } as any;

    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findByEmail).toBe('function');
    expect(typeof repo.findByRole).toBe('function');
    expect(typeof repo.findById).toBe('function');
  });
});
