import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { FRONTEND_ORIGIN_URI } from './api-constants';

/**
 * Generates a base64-hash string
 *
 * @param objJsonStr
 * @returns
 */
export function generateBase64Hash(objJsonStr: string | any): string {
  if (typeof objJsonStr !== 'string') {
    objJsonStr = JSON.stringify(objJsonStr);
  }
  return Buffer.from(objJsonStr).toString('base64');
}

/**
 * Resolves a base64-hash string
 *
 * @param hash
 * @returns
 */
export function resolveBase64Hash(hash: string): string {
  const buffer = Buffer.from(hash, 'base64');
  return buffer.toString('utf8');
}

/**
 *
 * @param req
 * @param path
 * @returns
 */
export function resolveFrontendOriginUrl(req: NextApiRequest, path?: string) {
  let origin;

  if (typeof FRONTEND_ORIGIN_URI === 'string') {
    origin = FRONTEND_ORIGIN_URI;
  } else {
    // Next.js doesn't apparenly provide the request origin in a way that's easy to use, have to parse it from the headers:
    const protocol = String(req.headers['x-forwarded-proto'] || 'https').split(
      ','
    )[0];
    origin = `${protocol}://${req.headers.host}`;
  }

  const redirectBackUrl = new URL(`${origin}`);

  if (path) {
    redirectBackUrl.pathname = path;
  }

  return redirectBackUrl;
}

/**
 *
 * @param idToken
 * @returns iso string
 */
export function resolveIdTokenExpiresAt(idToken: string): string {
  const decoded = jwt.decode(idToken) as jwt.JwtPayload;
  return new Date(decoded.exp * 1000).toISOString(); // convert seconds to milliseconds and then to ISO string
}
