import { LoggedInState } from '@mvp/../../../packages/vf-shared/src/types';
import { randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createApiAuthPackage(loggedInState: LoggedInState) {
  // Generate CSRF token
  const csrfToken = randomBytes(100).toString('base64');

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
  const encryptedApiAuthPackage = jwt.sign(apiAuthPackage, secretSignKey); // HMAC SHA256

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
