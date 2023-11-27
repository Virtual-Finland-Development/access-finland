import { NextRequest, NextResponse } from 'next/server';

/**
 * Match /info route and redirect to /info/about-the-service
 * the /info root page does not contain anything
 */
async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/info' ||
    request.nextUrl.pathname === '/info/'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/info/terms-of-use';
    return NextResponse.redirect(url);
  }
  return null;
}

export default middleware;
