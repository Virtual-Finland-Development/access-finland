import { generateKeyPair } from '../utils/rsa';

const keyPair = generateKeyPair();
console.log(`> Public key: 
${keyPair.publicKey}
`);
console.log(`> Private key:
${keyPair.privateKey}
`);
