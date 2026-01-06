import { z } from 'zod';
import { validate } from '@/lib/common/validation/validate';

// Schema untuk login dengan Role dan Password
export const LoginSchema = z.object({
  role: z.string().min(1, 'Role harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

export type LoginRequest = z.infer<typeof LoginSchema>;

export function parseLogin(data: unknown): LoginRequest {
  const validated = validate(LoginSchema, data);
  
  if (!validated.password || validated.password.trim().length === 0) {
    throw new Error('Password harus diisi');
  }
  
  if (!validated.role || validated.role.trim().length === 0) {
    throw new Error('Role harus diisi');
  }
  
  return validated;
}
