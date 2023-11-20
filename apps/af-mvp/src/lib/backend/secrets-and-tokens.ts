import { randomBytes } from 'crypto';
import * as jose from 'node-jose';
import { getStagedSecretParameter } from './services/aws/ParameterStore';

export async function encryptUsingBackendSecret(obj: object): Promise<string> {
  const publicKey = await getStagedSecretParameter('BACKEND_SECRET_PUBLIC_KEY');
  const key = await jose.JWK.asKey(publicKey, 'pem');
  return jose.JWE.createEncrypt({ format: 'compact', zip: true }, key)
    .update(JSON.stringify(obj))
    .final();
}

export async function decryptUsingBackendSecret<T = any>(
  encryptedData: string
) {
  const privateKey = await getStagedSecretParameter(
    'BACKEND_SECRET_PRIVATE_KEY'
  );
  const key = await jose.JWK.asKey(privateKey, 'pem');
  const result = await jose.JWE.createDecrypt(key).decrypt(encryptedData);
  return JSON.parse(result.payload.toString()) as T;
}

/**
 *
 * @returns A random string of 100 bytes
 */
export function generateCSRFToken() {
  return randomBytes(100).toString('base64');
}
