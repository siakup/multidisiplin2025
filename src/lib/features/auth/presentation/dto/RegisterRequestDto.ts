import { z } from 'zod';
import { validate } from '@/lib/common/validation/validate';

// Schema yang menerima email (optional) dan username (optional, tapi salah satu harus ada)
export const RegisterSchema = z.object({
  role: z.string().min(1, 'Role harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
  email: z.string().email().optional().or(z.literal('')),
  name: z.string().optional(),
});

export type RegisterRequest = z.infer<typeof RegisterSchema>;

export function parseRegister(data: unknown): RegisterRequest {
  const parsed = validate(RegisterSchema, data);

  // Normalize empty strings to undefined
  return {
    ...parsed,
    email: parsed.email && parsed.email.trim() !== '' ? parsed.email.trim() : undefined,
  };
}
