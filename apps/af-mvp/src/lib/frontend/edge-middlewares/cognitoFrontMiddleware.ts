import { NextRequest, NextResponse } from 'next/server';
import { FRONTEND_ORIGIN_URI } from '@mvp/lib/backend/api-constants';

async function middleware(request: NextRequest) {
  if (request.cookies.has('wafCognitoSession')) {
    try {
      // Check if waf-cognito frontend cookie present and valid, the call also clears the session if not valid
      await fetch(`${FRONTEND_ORIGIN_URI}/api/auth/cognito/verify`);
    } catch (error) {
      // Redirect to cognito login page (with WAF)
      const url = request.nextUrl.clone();
      url.pathname = '/api/auth/cognito/end-session';
      return NextResponse.redirect(url);
    }
  }
  return null;
}

export default middleware;
