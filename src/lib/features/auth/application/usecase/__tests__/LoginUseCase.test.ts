import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUseCase } from '@/lib/features/auth/application/usecase/LoginUseCase';
import { AppError } from '@/lib/common/errors/AppError';

const mockUserRepo = { findByRole: vi.fn(), findByEmail: vi.fn() };
const mockHashService = { compare: vi.fn() };
const mockSessionRepo = { create: vi.fn() };
const mockTokenService = { sign: vi.fn() };

// Mock UserMapper
vi.mock('../../infrastructure/mapper/UserMapper', () => ({
  toPublicUser: vi.fn((u) => u),
}));

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new LoginUseCase(
      mockUserRepo as any,
      mockHashService as any,
      mockSessionRepo as any,
      mockTokenService as any
    );
  });

  it('throws if user not found', async () => {
    mockUserRepo.findByRole.mockResolvedValue(null);
    await expect(useCase.execute({ role: 'ADMIN', password: 'pass' })).rejects.toThrow(AppError);
  });

  it('throws if password invalid', async () => {
    mockUserRepo.findByRole.mockResolvedValue({ id: '1', role: 'ADMIN', passwordHash: 'hash' });
    mockHashService.compare.mockReturnValue(false);
    await expect(useCase.execute({ role: 'ADMIN', password: 'pass' })).rejects.toThrow(AppError);
  });

  it('returns tokens if credentials valid', async () => {
    mockUserRepo.findByRole.mockResolvedValue({ id: '1', role: 'ADMIN', passwordHash: 'hash' });
    mockHashService.compare.mockReturnValue(true);
    mockTokenService.sign.mockReturnValue('token');
    mockSessionRepo.create.mockResolvedValue({} as any);

    const result = await useCase.execute({ role: 'ADMIN', password: 'pass' });
    expect(result.accessToken).toBe('token');
    expect(result.refreshToken).toBe('token');
  });
});
