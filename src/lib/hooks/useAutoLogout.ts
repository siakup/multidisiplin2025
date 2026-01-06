'use client';

import { useEffect, useRef, useCallback } from 'react';
import { logout } from '@/lib/common/utils/auth';

interface UseAutoLogoutOptions {
  idleTime?: number; // in milliseconds, default 300000 (5 menit)
  enabled?: boolean; // default true
}

/**
 * Hook untuk auto logout berdasarkan idle time (tidak ada aktivitas user)
 * 
 * @param options - Configuration options
 * @param options.idleTime - Waktu idle dalam milliseconds sebelum logout (default: 300000 = 5 menit)
 * @param options.enabled - Enable/disable auto logout (default: true)
 * 
 * @example
 * ```tsx
 * // Auto logout setelah 5 menit tidak ada aktivitas (default)
 * useAutoLogout();
 * 
 * // Auto logout setelah 10 menit tidak ada aktivitas
 * useAutoLogout({ idleTime: 600000 });
 * 
 * // Disable auto logout
 * useAutoLogout({ enabled: false });
 * ```
 */
export function useAutoLogout(options: UseAutoLogoutOptions = {}) {
  const { idleTime = 300000, enabled = true } = options; // Default 5 menit (300000ms)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Function untuk reset timer
  const resetTimer = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity time
    lastActivityRef.current = Date.now();

    // Set new timeout untuk auto logout
    timeoutRef.current = setTimeout(() => {
      const idleDuration = Date.now() - lastActivityRef.current;
      const idleMinutes = Math.floor(idleDuration / 60000);
      console.log(`Auto logout: User idle selama ${idleMinutes} menit (${idleTime / 60000} menit limit)`);
      logout();
    }, idleTime);
  }, [idleTime, enabled]);

  // Function untuk handle user activity
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      // Clear timeout jika disabled
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Event listeners untuk mendeteksi aktivitas user
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    // Initial timer setup
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, handleActivity, resetTimer]);

  // Function untuk manually clear timeout (jika diperlukan)
  const clearAutoLogout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Function untuk reset timer secara manual
  const resetAutoLogout = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return { clearAutoLogout, resetAutoLogout };
}

