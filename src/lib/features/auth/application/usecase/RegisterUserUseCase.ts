import { UserRepository } from '../../domain/port/UserRepository';
import { SHA256Service } from '../../infrastructure/adapter/SHA256Service';
import { AuthDomainService } from '../../domain/service/AuthDomainService';
import { RegisterRequest } from '@/lib/features/auth/presentation/dto/RegisterRequestDto';
import { AppError } from '@/lib/common/errors/AppError';

export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: SHA256Service
  ) { }

  async execute({ role, password, email, name }: RegisterRequest) {
    const domainService = new AuthDomainService(this.userRepo);

    // Cek apakah role sudah diambil
    const existingUser = await this.userRepo.findByRole(role);
    if (existingUser) {
      throw new AppError('Role sudah digunakan atau akun sudah ada', 409);
    }

    // Jika email ada, cek tidak duplikat
    if (email) {
      const existingEmail = await this.userRepo.findByEmail(email);
      if (existingEmail) {
        throw new AppError('Email sudah digunakan', 409);
      }
    }

    // Hash password menggunakan SHA-256
    const passwordHash = this.hashService.hashPassword(password);

    const user = await this.userRepo.create(role, passwordHash, name, email);
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };
  }
}
