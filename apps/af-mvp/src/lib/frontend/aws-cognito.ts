import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.LOGIN_SYSTEM_COGNITO_CLIENT_ID!,
      userPoolId: process.env.LOGIN_SYSTEM_COGNITO_USER_POOL_ID!,
      userPoolEndpoint: process.env.LOGIN_SYSTEM_COGNITO_USER_POOL_ENDPOINT!,
      loginWith: {
        email: true,
      },
    },
  },
});
