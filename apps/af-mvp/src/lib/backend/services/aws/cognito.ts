import { CognitoJwtVerifier } from 'aws-jwt-verify';

export async function validateCognitoAccessToken(idToken: string) {
  // AWS Cognito verifier that expects valid access tokens
  const userPoolId = process.env.WAF_USER_POOL_ID;
  const userPoolClientId = process.env.WAF_USER_POOL_CLIENT_ID;
  const verifier = CognitoJwtVerifier.create({
    userPoolId: userPoolId!,
    tokenUse: 'id',
    clientId: userPoolClientId!,
  });
  return await verifier.verify(idToken); // throws if invalid
}
