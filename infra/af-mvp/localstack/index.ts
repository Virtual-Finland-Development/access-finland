import { createLoginSystemCognitoUserPool } from '../resources/cognito';

const loginSystem = createLoginSystemCognitoUserPool();

export const VirtualFinlandAuthCognitoUserPoolId = loginSystem.userPool.id;
export const VirtualFinlandAuthCognitoPoolClientId =
  loginSystem.userPoolClient.id;
