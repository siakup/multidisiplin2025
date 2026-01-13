import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtTokenService } from '@/lib/features/auth/infrastructure/adapter/TokenServiceJwt';

vi.mock('@/lib/common/config/env', () => ({
  env: { JWT_SECRET: '12345678901234567890123456789012' }
}));

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  beforeEach(() => {
    service = new JwtTokenService();
  });

  it('signs a token', () => {
    const token = service.sign({ userId: '1' });
    expect(typeof token).toBe('string');
  });

  it('verifies a token', () => {
    const token = service.sign({ userId: '1' });
    const payload = service.verify<{ userId: string }>(token);
    expect(payload.userId).toBe('1');
  });
});
