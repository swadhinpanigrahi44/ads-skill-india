'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore, AuthUser } from '@/store/authStore';

export function useAuthFeature() {
  const { setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setAuth(
      (response as { data: { accessToken: string; user: AuthUser } }).data.accessToken,
      (response as { data: { accessToken: string; user: AuthUser } }).data.user,
    );
    return (response as { data: unknown }).data;
  }, [setAuth]);

  const register = useCallback(async (data: {
    fullName: string;
    email: string;
    mobile: string;
    state: string;
    password: string;
    referralCode?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return (response as { data: unknown }).data;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);

  return { login, register, logout };
}
