'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  isRoleAllowed,
  isUsernameAllowed,
} from '@/lib/common/utils/identity';

interface UseRequireAuthOptions {
  /**
   * Allowed user roles (matches the value stored in localStorage as `userRole`)
   */
  allowedRoles?: string[];
  /**
   * Allowed usernames (matches `userUsername` in localStorage)
   */
  allowedUsernames?: string[];
  /**
   * Path to redirect when the user does not have the required role/username.
   * Defaults to `/login`.
   */
  fallbackPath?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const {
    allowedRoles = [],
    allowedUsernames = [],
    fallbackPath = '/login',
  } = options;
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const allowedRolesKey = useMemo(
    () => allowedRoles.slice().sort().join('|'),
    [allowedRoles]
  );

  const allowedUsernamesKey = useMemo(
    () => allowedUsernames.slice().sort().join('|'),
    [allowedUsernames]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    const userUsername = localStorage.getItem('userUsername');

    if (!token) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace('/login');
      return;
    }

    const roleAllowed = isRoleAllowed(userRole, allowedRoles);
    const usernameAllowed = isUsernameAllowed(userUsername, allowedUsernames);

    if (!roleAllowed && !usernameAllowed) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(fallbackPath);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [router, allowedRolesKey, allowedUsernamesKey, fallbackPath]);

  return { isAuthorized, isChecking };
}


