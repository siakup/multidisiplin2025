// AuthContainer wires up feature-specific implementations and exposes usecases.
import { PrismaUserRepository } from '@/lib/features/auth/infrastructure/adapter/UserRepositoryPrisma';
import { PrismaSessionRepository } from '@/lib/features/auth/infrastructure/adapter/SessionRepositoryPrisma';
import { JwtTokenService } from '@/lib/features/auth/infrastructure/adapter/TokenServiceJwt';
import { SHA256Service } from '@/lib/features/auth/infrastructure/adapter/SHA256Service';
import { RegisterUserUseCase } from '@/lib/features/auth/application/usecase/RegisterUserUseCase';
import { LoginUseCase } from '@/lib/features/auth/application/usecase/LoginUseCase';
import { RefreshTokenUseCase } from '@/lib/features/auth/application/usecase/RefreshTokenUseCase';
import { LogoutUseCase } from '@/lib/features/auth/application/usecase/LogoutUseCase';

export class AuthContainer {
  static instance: AuthContainer | null = null;

  userRepo = new PrismaUserRepository();
  sessionRepo = new PrismaSessionRepository();
  tokenService = new JwtTokenService();
  hashService = new SHA256Service();

  registerUseCase = new RegisterUserUseCase(this.userRepo, this.hashService);
  loginUseCase = new LoginUseCase(this.userRepo, this.hashService, this.sessionRepo, this.tokenService);
  refreshUseCase = new RefreshTokenUseCase(this.sessionRepo, this.tokenService);
  logoutUseCase = new LogoutUseCase(this.sessionRepo);

  private constructor() {}

  static getInstance() {
    if (!AuthContainer.instance) AuthContainer.instance = new AuthContainer();
    return AuthContainer.instance;
  }
}
