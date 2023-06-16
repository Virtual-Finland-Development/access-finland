import { LoggedInState } from '@mvp/../../../packages/vf-shared/src/types';
import { randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createApiAuthPackage(loggedInState: LoggedInState) {
  const csrfToken = generateCSRFToken();

  try {
    // Dummy check the token decodes
    jwt.decode(loggedInState.idToken);
  } catch (error) {
    console.error(error);
    throw new Error('Invalid idToken');
  }

  const apiAuthPackage = {
    ...loggedInState,
    csrfToken: csrfToken,
  };

  const secretSignKey = resolveSecretSignKey();

  // Encrypt using secret
  const encryptedApiAuthPackage = jwt.sign(apiAuthPackage, secretSignKey, {
    expiresIn: Math.floor(
      new Date(loggedInState.expiresAt).getTime() / 1000 - Date.now() / 1000
    ), // seconds to the expiresAt date
  }); // HMAC SHA256

  return {
    state: apiAuthPackage,
    encrypted: encryptedApiAuthPackage,
  };
}

export function decryptApiAuthPackage(apiAuthPackageEncrypted: string) {
  const secretSignKey = resolveSecretSignKey();

  // Decrypt using secret
  const decryptedApiAuthPackage = jwt.verify(
    apiAuthPackageEncrypted,
    secretSignKey
  ) as JwtPayload;

  return decryptedApiAuthPackage;
}

/**
 * Resolve (not super secret, safe to keep in runtime env) secret sign key
 */
function resolveSecretSignKey() {
  return process.env.BACKEND_SECRET_SIGN_KEY || 'local-secret-key';
}

/**
 *
 * @returns A random string of 100 bytes
 */
export function generateCSRFToken() {
  return randomBytes(100).toString('base64');
}
