import { jest } from '@jest/globals';
import {
  decryptUsingBackendSecret,
  encryptUsingBackendSecret,
  generateCSRFToken,
  verifyCSRFToken,
} from '@mvp/lib/backend/secrets-and-tokens';

// Mock BACKEND_SECRET_PUBLIC_KEY, BACKEND_SECRET_PRIVATE_KEY and BACKEND_HASHGEN_KEY
jest.mock('@aws-sdk/client-ssm', () => {
  const { generateKeyPairSync, randomBytes } = require('crypto');

  const keyPair = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  const hashKey = randomBytes(64).toString('base64');

  return {
    SSMClient: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockImplementation((command: any) => {
          if (command.Name === 'local_BACKEND_SECRET_PUBLIC_KEY') {
            return {
              Parameter: {
                Value: keyPair.publicKey,
              },
            };
          } else if (command.Name === 'local_BACKEND_SECRET_PRIVATE_KEY') {
            return {
              Parameter: {
                Value: keyPair.privateKey,
              },
            };
          } else if (command.Name === 'local_BACKEND_HASHGEN_KEY') {
            return {
              Parameter: {
                Value: hashKey,
              },
            };
          } else {
            throw new Error(`Invalid parameter name: ${command.Name}`);
          }
        }),
      };
    }),
    GetParameterCommand: jest.fn().mockImplementation((command: any) => {
      return command;
    }),
  };
});

describe('API Tests', () => {
  it('encryption', async () => {
    const data = {
      name: 'test',
    };
    const encrypted = await encryptUsingBackendSecret(data);
    expect(encrypted).toBeTruthy();

    const decrypted = await decryptUsingBackendSecret(encrypted);
    expect(decrypted?.name).toBe(data.name);
  });

  it('hashing', async () => {
    const token = await generateCSRFToken();
    expect(token).toBeTruthy();
    await verifyCSRFToken(token); // should not throw
    await expect(verifyCSRFToken('invalid')).rejects.toThrow();
  });
});
