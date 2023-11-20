import { jest } from '@jest/globals';
import {
  decryptUsingBackendSecret,
  encryptUsingBackendSecret,
} from '@mvp/lib/backend/secrets-and-tokens';

// Mock BACKEND_SECRET_PUBLIC_KEY and BACKEND_SECRET_PRIVATE_KEY
jest.mock('@aws-sdk/client-ssm', () => {
  const { generateKeyPairSync } = require('crypto');

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
});
