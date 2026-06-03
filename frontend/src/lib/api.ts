import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    useAuthStore.getState().setAccessToken(data.data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      const newToken = useAuthStore.getState().accessToken;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          ...options.headers,
        },
        ...options,
      });
      if (!retryResponse.ok) {
        const err = await retryResponse.json().catch(() => ({}));
        throw new Error((err as { error?: { message?: string } })?.error?.message || retryResponse.statusText);
      }
      return retryResponse.json();
    }
    useAuthStore.getState().clearAuth();
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_hint=; path=/; max-age=0; SameSite=Lax';
    }
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } })?.error?.message || response.statusText);
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: unknown) =>
    apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: unknown) =>
    apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
};
