import { NextResponse, type NextRequest } from 'next/server';

// Optimistic gate only: the API is the real authority (it validates the JWT and tokenVersion on every call).
const PROTECTED = ['/dashboard', '/financials', '/goals', '/scenarios', '/reports', '/profile'];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has('fs_token');
  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/')) && !hasSession) {
    const url = req.nextUrl.clone(); url.pathname = '/login'; url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if ((pathname === '/login' || pathname === '/register') && hasSession) {
    const url = req.nextUrl.clone(); url.pathname = '/dashboard'; url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*', '/financials/:path*', '/goals/:path*', '/scenarios/:path*', '/reports/:path*', '/profile/:path*', '/login', '/register'] };
