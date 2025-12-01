import { z } from 'zod';
import { validate } from '@/lib/common/validation/validate';

// Schema yang menerima email atau username (field 'email' bisa berisi email atau username)
export const LoginSchema = z.object({
  email: z.string().min(1, 'Email atau username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

export type LoginRequest = z.infer<typeof LoginSchema>;

export function parseLogin(data: unknown): LoginRequest {
  // Validasi basic dulu
  const validated = validate(LoginSchema, data);
  
  // Password minimal 1 karakter (bukan min 6 karena mungkin password pendek seperti "1234")
  if (!validated.password || validated.password.trim().length === 0) {
    throw new Error('Password harus diisi');
  }
  
  return validated;
}
