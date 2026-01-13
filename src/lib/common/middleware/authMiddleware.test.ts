import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { authMiddleware } from './authMiddleware';
import * as tokenUtils from '../utils/token';

describe('authMiddleware', () => {
  it('should allow request with valid token', () => {
    vi.spyOn(tokenUtils, 'verifyToken').mockReturnValue({ userId: '123' } as any);

    const req = {
      headers: new Headers([['authorization', 'Bearer validtoken']]),
    } as unknown as NextRequest;

    const res = authMiddleware(req);
    expect((req as any).user).toEqual({ userId: '123' });
    expect(res.status).toBe(200);
  });

  it('should reject request with invalid token', () => {
    vi.spyOn(tokenUtils, 'verifyToken').mockImplementation(() => {
      throw new Error('invalid');
    });

    const req = {
      headers: new Headers([['authorization', 'Bearer invalidtoken']]),
    } as unknown as NextRequest;

    const res = authMiddleware(req);
    expect(res.status).toBe(401);
  });
});
