import * as aws from '@pulumi/aws';
import * as tls from '@pulumi/tls';
import { ISetup } from '../utils/types';

export function generateBackendSecretKeyPair(setup: ISetup) {
  // Generate a private key
  const privateKey = new tls.PrivateKey(
    setup.nameResource('backend-private-key'),
    {
      algorithm: 'RSA',
      rsaBits: 2048,
    }
  );

  // Extract public key from private key
  const publicKey = tls.getPublicKeyOutput({
    privateKeyPem: privateKey.privateKeyPem,
  });

  publicKey.apply(publicKey => {
    createStagedParameterStoreSecret(
      setup,
      'BACKEND_SECRET_PUBLIC_KEY',
      publicKey.publicKeyPem,
      'Public key for backend'
    );
  });

  privateKey.privateKeyPem.apply(privateKey =>
    createStagedParameterStoreSecret(
      setup,
      'BACKEND_SECRET_PRIVATE_KEY',
      privateKey,
      'Private key for backend'
    )
  );
}

function createStagedParameterStoreSecret(
  setup: ISetup,
  name: string,
  value: string,
  description: string
) {
  return createParameterStoreSecret(
    setup,
    `${setup.envOverride}_${name}`,
    value,
    description
  );
}

function createParameterStoreSecret(
  setup: ISetup,
  name: string,
  value: string,
  description: string
) {
  return new aws.ssm.Parameter(name, {
    name,
    type: 'SecureString',
    value,
    description,
    tags: setup.tags,
  });
}
