import * as aws from '@pulumi/aws';
import * as random from '@pulumi/random';
import * as tls from '@pulumi/tls';
import setup, { nameResource } from '../utils/setup';

const { tags, envOverride } = setup;

export function generateBackendSecretKeyPair() {
  // Generate a private key
  const privateKey = new tls.PrivateKey(nameResource('backend-private-key'), {
    algorithm: 'RSA',
    rsaBits: 2048,
  });

  // Extract public key from private key
  const publicKey = tls.getPublicKeyOutput({
    privateKeyPem: privateKey.privateKeyPem,
  });

  publicKey.apply(publicKey => {
    createStagedParameterStoreSecret(
      'BACKEND_SECRET_PUBLIC_KEY',
      publicKey.publicKeyPem,
      'Public key for backend'
    );
  });

  privateKey.privateKeyPem.apply(privateKey =>
    createStagedParameterStoreSecret(
      'BACKEND_SECRET_PRIVATE_KEY',
      privateKey,
      'Private key for backend'
    )
  );
}

export function generateBackendHashGenKey() {
  const keyResource = new random.RandomString(
    nameResource('backend-hashgen-key'),
    {
      length: 64,
      special: false,
    }
  );

  keyResource.result.apply(key =>
    createStagedParameterStoreSecret(
      'BACKEND_HASHGEN_KEY',
      key,
      'Hashgen key for backend'
    )
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
