import { z } from 'zod';
import { validate } from '@/lib/common/validation/validate';

// Schema yang menerima email (optional) dan username (optional, tapi salah satu harus ada)
export const RegisterSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  username: z.string().min(1).optional(),
  password: z.string().min(1, 'Password harus diisi'),
  name: z.string().optional(),
}).refine(
  (data) => {
    const hasEmail = data.email && data.email.trim() !== '';
    const hasUsername = data.username && data.username.trim() !== '';
    return hasEmail || hasUsername;
  },
  {
    message: 'Email atau username harus diisi',
    path: ['email'],
  }
);

export type RegisterRequest = z.infer<typeof RegisterSchema>;

export function parseRegister(data: unknown): RegisterRequest {
  const parsed = validate(RegisterSchema, data);
  
  // Normalize empty strings to undefined
  return {
    ...parsed,
    email: parsed.email && parsed.email.trim() !== '' ? parsed.email.trim() : undefined,
    username: parsed.username && parsed.username.trim() !== '' ? parsed.username.trim() : undefined,
  };
}
