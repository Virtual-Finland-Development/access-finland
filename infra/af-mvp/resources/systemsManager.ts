import * as aws from '@pulumi/aws';
import { generateKeyPair } from '../utils/rsa';
import setup from '../utils/setup';

const { tags, envOverride } = setup;

export function generateBackendSecretKeyPair() {
  const keyPair = generateKeyPair(); // Now re-generates on every deployment: fixme
  createStagedParameterStoreSecret(
    'BACKEND_SECRET_PUBLIC_KEY',
    keyPair.publicKey,
    'Public key for backend'
  );
  createStagedParameterStoreSecret(
    'BACKEND_SECRET_PRIVATE_KEY',
    keyPair.privateKey,
    'Private key for backend'
  );
}

function createStagedParameterStoreSecret(
  name: string,
  value: string,
  description: string
) {
  return createParameterStoreSecret(
    `${envOverride}_${name}`,
    value,
    description
  );
}

function createParameterStoreSecret(
  name: string,
  value: string,
  description: string
) {
  return new aws.ssm.Parameter(name, {
    name,
    type: 'SecureString',
    value,
    description,
    tags,
  });
}
