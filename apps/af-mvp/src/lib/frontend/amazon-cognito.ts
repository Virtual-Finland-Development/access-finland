import { Passwordless } from 'amazon-cognito-passwordless-auth';

Passwordless.configure({
  cognitoIdpEndpoint: 'eu-north-1', // you can also use the full endpoint URL, potentially to use a proxy
  clientId: process.env.LOGIN_SYSTEM_COGNITO_CLIENT_ID || '',
  userPoolId: process.env.LOGIN_SYSTEM_COGNITO_USER_POOL_ID, // optional, only required if you want to use USER_SRP_AUTH
  //storage: localStorage, // Optional, default to localStorage
});
