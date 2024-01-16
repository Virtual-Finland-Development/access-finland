import { createHmac, randomBytes } from 'crypto';
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

export async function generateCSRFToken() {
  const key = await getCachingStagedSecretParameter('BACKEND_HASHGEN_KEY');
  const salt = randomBytes(32).toString('base64');
  const token = createHmac('sha256', key).update(salt).digest('hex');
  return `${salt}.${token}`;
}

export async function verifyCSRFToken(csrfToken: string) {
  if (typeof csrfToken !== 'string') {
    throw new Error('Invalid CSRF token');
  }
  const key = await getCachingStagedSecretParameter('BACKEND_HASHGEN_KEY');
  const [salt, token] = csrfToken.split('.');
  const expectedToken = createHmac('sha256', key).update(salt).digest('hex');
  if (token !== expectedToken) {
    throw new Error('Invalid CSRF token');
  }
}
