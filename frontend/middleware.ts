import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/pricing',
  '/contact',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p)
    || pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.startsWith('/images')
    || pathname.startsWith('/landing');

  if (isPublic) return NextResponse.next();

  // First-party hint cookie set by the frontend after login. The backend's
  // refresh cookie lives on a different domain and is invisible here.
  const hasSession = request.cookies.get('auth_hint')?.value;

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin-panel/:path*',
    '/profile',
    '/withdraw/:path*',
    '/courses/:path*',
    '/team/:path*',
    '/account/:path*',
    '/ads/:path*',
    '/settings/:path*',
    '/leaderboard',
    '/partner-program',
    '/certificates',
    '/support',
  ],
};
