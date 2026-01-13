import { parseLogin } from '@/lib/features/auth/presentation/dto/LoginRequestDto';
import { AppError } from '@/lib/common/errors/AppError';

describe('Login DTO', () => {
  it('parses valid data', () => {
    const data = { role: 'STUDENT_HOUSING', password: 'password' };
    const result = parseLogin(data);
    expect(result.role).toBe('STUDENT_HOUSING');
  });

  it('throws on missing role', () => {
    expect(() => parseLogin({ password: 'password' })).toThrow(AppError);
  });

  it('throws on short password', () => {
    // Schema in LoginRequestDto.ts uses .min(1), so '123' actually passes there.
    // If we want to strictly test empty password:
    expect(() => parseLogin({ role: 'ADMIN', password: '' })).toThrow(AppError);
  });
});
