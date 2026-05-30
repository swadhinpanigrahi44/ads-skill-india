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

  const userId = request.cookies.get('refresh_uid')?.value;

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user-app/:path*',
    '/admin-panel/:path*',
    '/dashboard/:path*',
  ],
};
