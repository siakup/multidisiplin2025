import { parseRegister } from '@/lib/features/auth/presentation/dto/RegisterRequestDto';
import { AppError } from '@/lib/common/errors/AppError';

describe('Register DTO', () => {
  it('parses valid data', () => {
    const data = { role: 'STUDENT_HOUSING', password: 'password', name: 'User', email: 'a@b.com' };
    const result = parseRegister(data);
    expect(result.role).toBe('STUDENT_HOUSING');
    expect(result.email).toBe('a@b.com');
  });

  it('throws on missing role', () => {
    expect(() => parseRegister({ password: 'password', email: 'a@b.com' })).toThrow(AppError);
  });

  it('parses even without optional email', () => {
    const data = { role: 'FACILITY', password: 'password' };
    const result = parseRegister(data);
    expect(result.role).toBe('FACILITY');
    expect(result.email).toBeUndefined();
  });
});
