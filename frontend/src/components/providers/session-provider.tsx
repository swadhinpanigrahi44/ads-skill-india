'use client';

import { useEffect } from 'react';
import { useAuthStore, AuthUser } from '@/store/authStore';
import { userService } from '@/lib/services';
import { setAuthHint, clearAuthHint } from '@/lib/session';

/**
 * Rehydrates the in-memory auth store on mount / page refresh.
 *
 * The access token lives only in memory (never localStorage), so on a fresh
 * page load it is null. We call /users/me — apiCall auto-refreshes via the
 * httpOnly refresh cookie on 401, then returns the user. If that fails the
 * middleware/redirect already sends the user to /login.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    let cancelled = false;
    if (user) {
      setAuthHint();
      setHydrated(true);
      return;
    }
    userService
      .getMe()
      .then((me) => {
        if (!cancelled) {
          setUser(me as unknown as AuthUser);
          setAuthHint();
        }
      })
      .catch(() => {
        // Session could not be restored (e.g. refresh cookie blocked/expired).
        if (!cancelled) clearAuthHint();
        /* apiCall handles redirect to /login on hard auth failure */
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
