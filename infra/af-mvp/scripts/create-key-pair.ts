// npx ts-node create-key-pair.ts
import { generateKeyPairSync } from 'crypto';

function generateKeyPair() {
  return generateKeyPairSync('rsa', {
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
}

const keyPair = generateKeyPair();
console.log(keyPair.publicKey);
console.log(keyPair.privateKey);
