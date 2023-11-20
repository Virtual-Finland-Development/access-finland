import jwt from 'jsonwebtoken';
import { LoggedInState } from '@shared/types';
import {
  decryptUsingBackendSecret,
  encryptUsingBackendSecret,
  generateCSRFToken,
} from './secrets-and-tokens';

export async function createApiAuthPackage(loggedInState: LoggedInState) {
  const csrfToken = generateCSRFToken();

  try {
    // Dummy check the token decodes
    jwt.decode(loggedInState.idToken!);
  } catch (error) {
    console.error(error);
    throw new Error('Invalid idToken');
  }

  const apiAuthPackage = {
    ...loggedInState,
    csrfToken: csrfToken,
  };

  // Encrypt using secret
  const encryptedApiAuthPackage = await encryptUsingBackendSecret(
    apiAuthPackage
  );

  console.log(
    'encryptedApiAuthPackage bytes: ',
    Buffer.byteLength(encryptedApiAuthPackage, 'utf8'),
    ' bytes'
  );

  return {
    data: apiAuthPackage,
    encrypted: encryptedApiAuthPackage,
  };
}

export function decryptApiAuthPackage(apiAuthPackageEncrypted: string) {
  return decryptUsingBackendSecret(apiAuthPackageEncrypted);
}
