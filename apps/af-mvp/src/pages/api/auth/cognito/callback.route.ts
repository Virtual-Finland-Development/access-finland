import { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@mvp/lib/backend/Logger';
import { requestLoggingMiddleware } from '@mvp/lib/backend/middleware/requestLogging';
import { encryptUsingBackendSecret } from '@mvp/lib/backend/secrets-and-tokens';
import { validateCognitoAccessToken } from '@mvp/lib/backend/services/aws/cognito';
import cookie from 'cookie';
import { object, parse, string } from 'valibot';

const CognitoLoginResponseSchema = object({
  id_token: string(),
  access_token: string(),
  expires_in: string(),
  token_type: string(),
  redirected_from_hash: string(),
});

function ifNotObjectOrEmptyObject(value: any): boolean {
  if (
    typeof value !== 'object' ||
    value === null ||
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
}

/**
 * For AWS WAF & Cognition login, sets the access cookie and redirects to the root page
 *
 * @param req
 * @param res
 * @returns
 */

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  logger: Logger
) {
  const queryParams = req.query;

  // A redirect hack to get the params from the url hash:
  // - AWS Cognito redirects to the callback with the params in the hash, nextjs doesn't parse the hash.
  // @see: https://stackoverflow.com/a/72071612
  if (ifNotObjectOrEmptyObject(queryParams)) {
    res.writeHead(302, { 'Content-Type': 'text/html' });
    res.write(`
        <script nonce="vfaf-${process.env.NEXT_PUBLIC_STAGE}">
            const queryString = window.location.hash.replace('#', '')
            window.location.href='${req.url}?redirected_from_hash=true&'+ queryString 
        </script>
    `);
    res.end();
    return res;
  }

  try {
    // Parse and validate
    const cognitoLoginResponse = parse(CognitoLoginResponseSchema, queryParams);
    const payload = await validateCognitoAccessToken(
      cognitoLoginResponse.id_token
    );

    // Success, redirect to the root page with the access cookies
    const sharedCookieSecret = process.env.WAF_SHARED_COOKIE_SECRET;
    const expirity = payload.exp * 1000;
    const encryptedCookie = await encryptUsingBackendSecret({
      idToken: cognitoLoginResponse.id_token,
    });

    res
      .setHeader('Set-Cookie', [
        cookie.serialize(
          'wafCognitoSession', // Cookie for the AWS WAF
          sharedCookieSecret!,
          {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(expirity),
          }
        ),
        cookie.serialize(
          'cognitoVerify', // Cookie for the backend verification
          encryptedCookie,
          {
            path: '/api',
            httpOnly: true,
            sameSite: 'lax', // Must be lax for the redirect (from sinuna, back to the app) to work
            expires: new Date(expirity),
          }
        ),
      ])
      .redirect(303, '/');
  } catch (error) {
    logger.error(error);
    res.status(401).json({ error: error.message, trace: error.stack });
  }
}

export default requestLoggingMiddleware(handler);
