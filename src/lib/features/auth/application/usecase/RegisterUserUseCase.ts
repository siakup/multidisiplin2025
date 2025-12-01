import { UserRepository } from '../../domain/port/UserRepository';
import { SHA256Service } from '../../infrastructure/adapter/SHA256Service';
import { AuthDomainService } from '../../domain/service/AuthDomainService';
import { RegisterRequest } from '@/lib/features/auth/presentation/dto/RegisterRequestDto';
import { AppError } from '@/lib/common/errors/AppError';

export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: SHA256Service
  ) {}

  async execute({ email, username, password, name }: RegisterRequest) {
    const domainService = new AuthDomainService(this.userRepo);

    // Validasi: email atau username harus ada
    if (!email && !username) {
      throw new AppError('Email atau username harus diisi', 400);
    }

    // Jika email ada, cek tidak duplikat
    if (email) {
      await domainService.ensureEmailNotTaken(email);
    }

    // Jika username ada, cek tidak duplikat
    if (username) {
      const existingUser = await this.userRepo.findByUsername(username);
      if (existingUser) {
        throw new AppError('Username sudah digunakan', 409);
      }
    }

    // Hash password menggunakan SHA-256
    const passwordHash = this.hashService.hashPassword(password);
    
    // Create user dengan email (optional) dan username
    const finalEmail = email || undefined;
    const finalUsername = username || (email ? email.split('@')[0] : 'user');
    
    const user = await this.userRepo.create(finalEmail || '', passwordHash, name, finalUsername);
    return { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      name: user.name 
    };
  }
}
