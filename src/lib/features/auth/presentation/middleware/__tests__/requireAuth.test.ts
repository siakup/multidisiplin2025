import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtTokenService } from '@/lib/features/auth/infrastructure/adapter/TokenServiceJwt';
import { requireAuth } from '@/lib/features/auth/presentation/middleware/AuthMiddleware';

const { mockVerify } = vi.hoisted(() => ({
  mockVerify: vi.fn(),
}));

vi.mock('@/lib/features/auth/infrastructure/adapter/TokenServiceJwt', () => {
  return {
    JwtTokenService: function () {
      return {
        verify: mockVerify,
      };
    },
  };
});

describe('requireAuth middleware', () => {
  let req: any;
  let res: any;
  const jsonMock = vi.fn();
  const statusMock = vi.fn(() => ({ json: jsonMock }));

  beforeEach(() => {
    vi.clearAllMocks();
    req = { headers: {} };
    res = { status: statusMock };
  });

  it('returns null if no auth header', async () => {
    const result = await requireAuth(req, res);
    expect(result).toBeNull();
    expect(statusMock).toHaveBeenCalledWith(401);
  });

  it('calls token verify if header present', async () => {
    mockVerify.mockReturnValue({ userId: 1 });
    req.headers = { authorization: 'Bearer token' };

    const result = await requireAuth(req, res);
    expect(result).toEqual({ userId: 1 });
    expect(mockVerify).toHaveBeenCalledWith('token');
  });

  it('returns null if verify throws', async () => {
    mockVerify.mockImplementation(() => {
      throw new Error('fail');
    });
    req.headers = { authorization: 'Bearer token' };

    const result = await requireAuth(req, res);
    expect(result).toBeNull();
    expect(statusMock).toHaveBeenCalledWith(401);
  });
});
