/**
 * First-party session hint cookie.
 *
 * The backend's refresh cookie is set on its own domain (e.g. onrender.com),
 * which the Next.js middleware running on the frontend domain (vercel.app)
 * cannot read. So for route-gating we set a lightweight, non-sensitive,
 * first-party cookie on the FRONTEND domain after login. It carries no secret —
 * it only tells the middleware "a session exists"; the real auth is still the
 * in-memory access token + httpOnly refresh token.
 */
const HINT = 'auth_hint';
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days, matches refresh token

export function setAuthHint() {
  if (typeof document === 'undefined') return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${HINT}=1; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearAuthHint() {
  if (typeof document === 'undefined') return;
  document.cookie = `${HINT}=; path=/; max-age=0; SameSite=Lax`;
}
