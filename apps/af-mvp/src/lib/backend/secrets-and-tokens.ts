import { createHash, randomBytes } from 'crypto';
import * as jose from 'node-jose';
import { getCachingStagedSecretParameter } from './services/aws/ParameterStore';

export async function encryptUsingBackendSecret(obj: object): Promise<string> {
  const publicKey = await getCachingStagedSecretParameter(
    'BACKEND_SECRET_PUBLIC_KEY'
  );
  const key = await jose.JWK.asKey(publicKey, 'pem');
  return jose.JWE.createEncrypt({ format: 'compact', zip: true }, key)
    .update(JSON.stringify(obj))
    .final();
}

export async function decryptUsingBackendSecret(encryptedData: string) {
  const privateKey = await getCachingStagedSecretParameter(
    'BACKEND_SECRET_PRIVATE_KEY'
  );
  const key = await jose.JWK.asKey(privateKey, 'pem');
  const result = await jose.JWE.createDecrypt(key).decrypt(encryptedData);
  return JSON.parse(result.payload.toString());
}

/**
 * Creates a CSRF token that can be used to verify that a request is coming from the frontend using a backend secret
 *
 * @returns
 */
export async function generateCSRFToken() {
  const key = await getCachingStagedSecretParameter('BACKEND_HASHGEN_KEY');
  const salt = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(`${salt}:${key}`).digest('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies that a CSRF token is valid using a backend secret
 *
 * @param csrfToken
 */
export async function verifyCSRFToken(csrfToken: string) {
  if (typeof csrfToken !== 'string') {
    throw new Error('Invalid CSRF token');
  }

  const key = await getCachingStagedSecretParameter('BACKEND_HASHGEN_KEY');
  const [salt, hash] = csrfToken.split(':');

  const expectHash = createHash('sha256')
    .update(`${salt}:${key}`)
    .digest('hex');
  if (hash !== expectHash) {
    throw new Error('Invalid CSRF token');
  }
}
