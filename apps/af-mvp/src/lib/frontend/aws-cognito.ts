import { Amplify } from 'aws-amplify';
import {
  confirmSignIn as confirmSignInWithCognito,
  fetchUserAttributes,
  forgetDevice,
  rememberDevice,
  signIn as signInWithCognito,
  signOut as signOutWithCognito,
  signUp as signUpWithCognito,
} from 'aws-amplify/auth';
import { randomBytes } from 'crypto';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_CLIENT_ID!,
      userPoolId: process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ID!,
      userPoolEndpoint:
        process.env.NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ENDPOINT!,
      loginWith: {
        email: true,
      },
    },
  },
});

export async function fetchUser() {
  try {
    const user = await fetchUserAttributes();
    console.log(user);
    return user;
  } catch (error) {
    return null;
  }
}

export async function signIn(email: string) {
  const { isSignedIn, nextStep } = await signInWithCognito({
    username: email,
    options: {
      authFlowType: 'CUSTOM_WITHOUT_SRP',
    },
  });

  console.log(isSignedIn, nextStep);
}

export async function signUp(email: string) {
  const { isSignUpComplete, userId, nextStep } = await signUpWithCognito({
    username: email,
    password: getRandomString(30), // This is not used but require a value
    options: {
      userAttributes: {
        email,
      },
      autoSignIn: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
    },
  });
  console.log(isSignUpComplete, userId, nextStep);
}

export async function confirmSignIn(code: string) {
  // Send the answer to the User Pool
  // This will throw an error if it’s the 3rd wrong answer
  try {
    const { isSignedIn, nextStep } = await confirmSignInWithCognito({
      challengeResponse: code,
    });
    console.log('isSignedIn', isSignedIn);
    console.log('nextStep', nextStep);
    return isSignedIn;
  } catch (error) {
    console.log('error confirming sign up', error);
    return false;
  }
}

export async function signOut() {
  await signOutWithCognito();
}

function getRandomString(bytes: number) {
  return randomBytes(bytes).toString('base64');
}
