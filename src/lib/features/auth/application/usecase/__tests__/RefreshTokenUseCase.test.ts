import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RefreshTokenUseCase } from '@/lib/features/auth/application/usecase/RefreshTokenUseCase';
import { AppError } from '@/lib/common/errors/AppError';

// 🔹 Mock logger
vi.mock('@/lib/common/logger/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

const mockSessionRepo = { findByRefreshToken: vi.fn() };
const mockTokenService = { verify: vi.fn(), sign: vi.fn() };

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new RefreshTokenUseCase(mockSessionRepo as any, mockTokenService as any);
  });

  it('throws if session not found', async () => {
    mockTokenService.verify.mockReturnValue({ userId: '1' });
    mockSessionRepo.findByRefreshToken.mockResolvedValue(null);
    await expect(useCase.execute({ refreshToken: 'token' })).rejects.toThrow(AppError);
  });

  it('throws if token userId tidak sesuai session', async () => {
    mockTokenService.verify.mockReturnValue({ userId: '2' });
    mockSessionRepo.findByRefreshToken.mockResolvedValue({
      userId: '1',
      expiresAt: new Date(Date.now() + 10000),
    });
    await expect(useCase.execute({ refreshToken: 'token' })).rejects.toThrow(AppError);
  });

  it('throws if refresh token expired', async () => {
    mockTokenService.verify.mockReturnValue({ userId: '1' });
    mockSessionRepo.findByRefreshToken.mockResolvedValue({
      userId: '1',
      expiresAt: new Date(Date.now() - 10000),
    });
    await expect(useCase.execute({ refreshToken: 'token' })).rejects.toThrow(AppError);
  });

  it('returns access token if valid', async () => {
    mockTokenService.verify.mockReturnValue({ userId: '1' });
    mockSessionRepo.findByRefreshToken.mockResolvedValue({
      userId: '1',
      expiresAt: new Date(Date.now() + 10000),
    });
    mockTokenService.sign.mockReturnValue('accessToken');

    const result = await useCase.execute({ refreshToken: 'token' });
    expect(result.accessToken).toBe('accessToken');
  });
});
