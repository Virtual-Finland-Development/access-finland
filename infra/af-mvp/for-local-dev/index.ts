import * as pulumi from '@pulumi/pulumi';
import { createLoginSystemCognitoUserPool } from '../resources/cognito';
import setup from '../utils/setup';

const {
  awsSetup: { region },
} = setup;

const loginSystem = createLoginSystemCognitoUserPool('forLocalDev');

export const VirtualFinlandAuthCognitoUserPoolId = loginSystem.userPool.id;
export const VirtualFinlandAuthCognitoPoolClientId =
  loginSystem.userPoolClient.id;
export const VirtualFinlandAuthCognitoUrl = pulumi.interpolate`https://cognito-idp.${region}.amazonaws.com/${loginSystem.userPool.id}`;
