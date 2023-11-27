import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import cognitoFrontMiddleware from './lib/frontend/edge-middlewares/cognitoFrontMiddleware';
import infoPageMiddleware from './lib/frontend/edge-middlewares/infoPageMiddleware';

// The middlewares are executed in order, the first one to return a response will be used
const middlewares: Array<FrontendMiddlewareFunction> = [
  cognitoFrontMiddleware,
  infoPageMiddleware,
];

export async function middleware(request: NextRequest) {
  for (const middlewareFunction of middlewares) {
    const response = await middlewareFunction(request);
    if (response) {
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
