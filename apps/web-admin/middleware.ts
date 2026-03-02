import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_STORAGE_KEYS } from '@/lib/storage-keys';

const PUBLIC_PATHS = ['/login', '/unauthorized'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get(ADMIN_STORAGE_KEYS.AUTH_COOKIE)?.value;
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_STORAGE_KEYS.AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
