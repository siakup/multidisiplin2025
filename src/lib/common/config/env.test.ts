import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

describe('env config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should parse environment variables correctly', async () => {
    process.env.DATABASE_URL = 'postgres://localhost:5432/db';
    process.env.JWT_SECRET = '12345678901234567890123456789012';
    process.env.NODE_ENV = 'development';

    // Use dynamic import to re-evaluate the module with new env variables
    const { env } = await import('./env');
    expect(env.DATABASE_URL).toBe('postgres://localhost:5432/db');
    expect(env.JWT_SECRET).toBe('12345678901234567890123456789012');
    expect(env.NODE_ENV).toBe('development');
  });

  it('should throw error if JWT_SECRET is too short', async () => {
    process.env.DATABASE_URL = 'postgres://localhost:5432/db';
    process.env.JWT_SECRET = 'short';
    process.env.NODE_ENV = 'development';

    await expect(import('./env')).rejects.toThrow();
  });
});
