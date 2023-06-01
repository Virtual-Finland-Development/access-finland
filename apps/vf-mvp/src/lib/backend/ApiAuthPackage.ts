import { randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createApiAuthPackage(idToken: string) {
  // Generate CSRF token
  const csrfToken = randomBytes(100).toString('base64');
  let parsedTokenExp: number;

  try {
    // Resolve idToken expiration
    const parsedToken = jwt.decode(idToken) as JwtPayload;
    if (typeof parsedToken?.exp !== 'number') {
      throw new Error('Invalid exp in idToken.');
    }

    parsedTokenExp = parsedToken.exp;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid idToken');
  }

  const apiAuthPackage = {
    idToken: idToken,
    exp: parsedTokenExp,
    csrfToken: csrfToken,
  };

  const secretSignKey = resolveSecretSignKey();

  // Encrypt using secret
  const encryptedApiAuthPackage = jwt.sign(apiAuthPackage, secretSignKey); // HMAC SHA256

  return {
    encrypted: encryptedApiAuthPackage,
    csrfToken: csrfToken,
    exp: parsedTokenExp,
  };
}

export function decryptApiAuthPackage(apiAuthPackageEncrypted: string) {
  const secretSignKey = resolveSecretSignKey();

  // Decrypt using secret
  const decryptedApiAuthPackage = jwt.verify(
    apiAuthPackageEncrypted,
    secretSignKey
  ) as JwtPayload;

  return {
    idToken: decryptedApiAuthPackage.idToken,
    csrfToken: decryptedApiAuthPackage.csrfToken,
    exp: decryptedApiAuthPackage.exp,
  };
}

/**
 * Resolve (not super secret, safe to keep in runtime env) secret sign key
 */
function resolveSecretSignKey() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return process.env.NEXT_PUBLIC_API_SECRET_SIGN_KEY || 'local-secret-key';
}
