import { randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { BACKEND_SECRET_SIGN_KEY } from './api-constants';

/**
 * Resolve (not super secret, safe to keep in runtime env) secret sign key
 */
function resolveSecretSignKey() {
  return BACKEND_SECRET_SIGN_KEY || 'local-secret-key';
}

export function decryptUsingBackendSecret<T = JwtPayload>(
  encryptedData: string
) {
  // Decrypt using secret
  return jwt.verify(encryptedData, resolveSecretSignKey()) as T;
}

export function encryptUsingBackendSecret(
  obj: string | object | Buffer,
  expiresIn: number
) {
  // Encrypt using secret
  return jwt.sign(obj, resolveSecretSignKey(), {
    expiresIn: expiresIn,
  }); // HMAC SHA256
}

/**
 *
 * @returns A random string of 100 bytes
 */
export function generateCSRFToken() {
  return randomBytes(100).toString('base64');
}
