import { randomBytes } from 'crypto';
import * as jose from 'jose';

export async function createApiAuthPackage(idToken: string) {
  // Generate CSRF token
  const csrfToken = randomBytes(100).toString('base64');
  let parsedTokenExp: number;

  try {
    // Resolve idToken expiration
    const parsedToken = jose.decodeJwt(idToken);

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

  const secretSignKey = new TextEncoder().encode(resolveSecretSignKey());

  // Encrypt using secret
  // const encryptedApiAuthPackage = jwt.sign(apiAuthPackage, secretSignKey); // HMAC SHA256
  const encryptedApiAuthPackage = await new jose.SignJWT(apiAuthPackage)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretSignKey);

  return {
    encrypted: encryptedApiAuthPackage,
    csrfToken: csrfToken,
    exp: parsedTokenExp,
  };
}

export async function decryptApiAuthPackage(apiAuthPackageEncrypted: string) {
  const secretSignKey = new TextEncoder().encode(resolveSecretSignKey());

  // Decrypt using secret
  const decryptedApiAuthPackage = await jose.jwtVerify(
    apiAuthPackageEncrypted,
    secretSignKey
  );

  const { payload } = decryptedApiAuthPackage;

  return {
    idToken: payload.idToken,
    csrfToken: payload.csrfToken,
    exp: payload.exp,
  };
}

/**
 * Resolve (not super secret, safe to keep in runtime env) secret sign key
 */
function resolveSecretSignKey() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  return process.env.NEXT_PUBLIC_API_SECRET_SIGN_KEY || 'local-secret-key';
}
