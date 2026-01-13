import { describe, it, expect, vi } from 'vitest';
import { PrismaSessionRepository } from '@/lib/features/auth/infrastructure/persistence/PrismaSessionRepository';

describe('PrismaSessionRepository interface', () => {
  it('should have create, findByRefreshToken, revokeByToken methods', () => {
    const repo: PrismaSessionRepository = {
      create: vi.fn() as any,
      findByRefreshToken: vi.fn() as any,
      revokeByToken: vi.fn() as any,
    } as any;

    expect(typeof repo.create).toBe('function');
    expect(typeof repo.findByRefreshToken).toBe('function');
    expect(typeof repo.revokeByToken).toBe('function');
  });
});
