import { UserRepository } from '../../domain/port/UserRepository';
import { SHA256Service } from '../../infrastructure/adapter/SHA256Service';
import { SessionRepository } from '../../domain/port/SessionRepository';
import { TokenService } from '../../domain/port/TokenService';
import { AppError } from '@/lib/common/errors/AppError';
import { toPublicUser } from '../../infrastructure/mapper/UserMapper';
import { LoginRequest } from '@/lib/features/auth/presentation/dto/LoginRequestDto';

export class LoginUseCase {
  constructor(
    private userRepo: UserRepository,
    private hashService: SHA256Service,
    private sessionRepo: SessionRepository,
    private tokenService: TokenService
  ) {}

  async execute({ role, password }: LoginRequest) {
    // Cari user berdasarkan role
    const user = await this.userRepo.findByRole(role);
    if (!user) throw new AppError('Role atau password salah', 401);

    // Hash password input dan bandingkan dengan hash di database
    const passwordHash = (user as any).passwordHash ?? (user as any).password;
    const valid = this.hashService.compare(password, passwordHash);
    if (!valid) throw new AppError('Role atau password salah', 401);

    // access token
    const accessToken = this.tokenService.sign({ userId: user.id }, { expiresIn: '15m' });
    // refresh token
    const refreshToken = this.tokenService.sign(
      { session: true, userId: user.id },
      { expiresIn: '7d' }
    );

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await this.sessionRepo.create(user.id, refreshToken, expiresAt);

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
      expiresAt,
    };
  }
}
