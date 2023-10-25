import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Match /info route and redirect to /info/about-the-service
 * /info root page does not contain anything
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/info/terms-of-use';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/info',
};
