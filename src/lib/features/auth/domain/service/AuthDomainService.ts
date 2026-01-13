import { UserRepository } from '../port/UserRepository';
import { AppError } from '@/lib/common/errors/AppError';

export class AuthDomainService {
  constructor(private userRepo: UserRepository) { }

  async ensureEmailNotTaken(email: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new AppError('Email sudah terdaftar', 400);
  }

  async ensureRoleNotTaken(role: string) {
    const existing = await this.userRepo.findByRole(role);
    if (existing) throw new AppError('Role sudah terdaftar', 400);
  }
}
