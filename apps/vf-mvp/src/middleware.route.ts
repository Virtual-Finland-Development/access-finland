import { NextRequest, NextResponse } from 'next/server';
import { decryptApiAuthPackage } from './lib/backend/ApiAuthPackage';

export async function middleware(req: NextRequest) {
  const apiAuthCookie = req.cookies.get('apiAuthPackage');
  const csrfToken = req.headers.get('x-csrf-token');

  if (!apiAuthCookie || !csrfToken) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }

  const apiAuthPackage = await decryptApiAuthPackage(apiAuthCookie.value);

  if (csrfToken !== apiAuthPackage.csrfToken) {
    return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/testbed-gw/:path*', '/api/users-api/:path*'],
};
