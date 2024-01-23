import { CognitoJwtVerifier } from 'aws-jwt-verify';

export async function validateCognitoIdToken(
  idToken: string,
  cognitoApp?: { userPoolId: string; userPoolClientId: string }
) {
  // AWS Cognito verifier that expects valid tokens
  if (!cognitoApp) {
    cognitoApp = {
      userPoolId: process.env.WAF_USER_POOL_ID!,
      userPoolClientId: process.env.WAF_USER_POOL_CLIENT_ID!,
    };
  }
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoApp.userPoolId,
    tokenUse: 'id',
    clientId: cognitoApp.userPoolClientId,
  });
  return await verifier.verify(idToken); // throws if invalid
}
