import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthDomainService } from '@/lib/features/auth/domain/service/AuthDomainService';
import { AppError } from '@/lib/common/errors/AppError';

const mockUserRepo = { findByEmail: vi.fn(), findByRole: vi.fn() };

describe('AuthDomainService', () => {
  let service: AuthDomainService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthDomainService(mockUserRepo as any);
  });

  it('throws if email already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: '1', email: 'a@b.com' });
    await expect(service.ensureEmailNotTaken('a@b.com')).rejects.toThrow(AppError);
  });

  it('does not throw if email is available', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    await expect(service.ensureEmailNotTaken('new@b.com')).resolves.toBeUndefined();
  });

  it('throws if role already exists', async () => {
    mockUserRepo.findByRole.mockResolvedValue({ id: '1', role: 'ADMIN' });
    await expect(service.ensureRoleNotTaken('ADMIN')).rejects.toThrow(AppError);
  });
});
