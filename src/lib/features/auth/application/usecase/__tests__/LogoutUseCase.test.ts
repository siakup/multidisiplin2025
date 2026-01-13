import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogoutUseCase } from '@/lib/features/auth/application/usecase/LogoutUseCase';

const mockSessionRepo = { revokeByToken: vi.fn() };

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new LogoutUseCase(mockSessionRepo as any);
  });

  it('calls revokeByToken', async () => {
    await useCase.execute({ refreshToken: 'token' });
    expect(mockSessionRepo.revokeByToken).toHaveBeenCalledWith('token');
  });
});
