export type AuthResponse = {
  user: { 
    id: number; 
    email?: string | null; 
    username?: string | null; 
    name?: string | null;
    role?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};
