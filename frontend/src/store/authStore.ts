import { create } from 'zustand';

export interface AuthUser {
  id: string;
  adsId: string;
  fullName: string;
  email: string;
  mobile: string;
  state: string;
  role: 'USER' | 'SUB_ADMIN' | 'MASTER_ADMIN';
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  referralCode: string;
  avatarUrl?: string | null;
  twoFAEnabled?: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  hydrated: boolean; // true once the initial session bootstrap has finished
  setAuth: (accessToken: string, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setHydrated: (v: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  hydrated: false,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setHydrated: (hydrated) => set({ hydrated }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
