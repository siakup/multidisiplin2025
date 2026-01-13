import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterUserUseCase } from '@/lib/features/auth/application/usecase/RegisterUserUseCase';
import { AppError } from '@/lib/common/errors/AppError';

const mockUserRepo = { findByRole: vi.fn(), findByEmail: vi.fn(), create: vi.fn() };
const mockHashService = { hashPassword: vi.fn() };

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new RegisterUserUseCase(mockUserRepo as any, mockHashService as any);
  });

  it('throws if role already taken', async () => {
    mockUserRepo.findByRole.mockResolvedValue({ id: '1' });
    await expect(useCase.execute({ role: 'ADMIN', password: 'pass' })).rejects.toThrow(AppError);
  });

  it('creates user if role not taken', async () => {
    mockUserRepo.findByRole.mockResolvedValue(null);
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockHashService.hashPassword.mockReturnValue('hashed');
    mockUserRepo.create.mockResolvedValue({ id: '1', role: 'ADMIN', name: 'User' });

    const result = await useCase.execute({ role: 'ADMIN', password: 'pass', name: 'User' });
    expect(result.id).toBe('1');
    expect(mockUserRepo.create).toHaveBeenCalled();
  });
});
