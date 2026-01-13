import { describe, it, expect, vi } from 'vitest';
import { AppContainer } from './AppContainer';

vi.mock('../../features/auth/AuthContainer', () => ({
  AuthContainer: { getInstance: vi.fn(() => 'mockAuth') },
}));

describe('AppContainer', () => {
  it('should provide auth instance', () => {
    expect(AppContainer.auth).toBe('mockAuth');
  });
});
