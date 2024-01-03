import { Amplify } from 'aws-amplify';
import {
  confirmSignIn as confirmSignInWithCognito,
  fetchAuthSession as fetchAuthSessionFromCognito,
  signIn as signInWithCognito,
  signOut as signOutWithCognito,
  signUp as signUpWithCognito,
} from 'aws-amplify/auth';
import { randomBytes } from 'crypto';

// @see: https://docs.amplify.aws/javascript/build-a-backend/auth/advanced-workflows/

// https://github.com/aws-amplify/amplify-js/blob/main/packages/auth/src/providers/cognito/types/errors.ts
enum GetUserException {
  ForbiddenException = 'ForbiddenException',
  InternalErrorException = 'InternalErrorException',
  InvalidParameterException = 'InvalidParameterException',
  NotAuthorizedException = 'NotAuthorizedException',
  PasswordResetRequiredException = 'PasswordResetRequiredException',
  ResourceNotFoundException = 'ResourceNotFoundException',
  TooManyRequestsException = 'TooManyRequestsException',
  UserNotConfirmedException = 'UserNotConfirmedException',
  UserNotFoundException = 'UserNotFoundException',
}

// https://github.com/aws-amplify/amplify-js/blob/main/packages/auth/src/providers/cognito/types/errors.ts
enum SignUpException {
  CodeDeliveryFailureException = 'CodeDeliveryFailureException',
  InternalErrorException = 'InternalErrorException',
  InvalidEmailRoleAccessPolicyException = 'InvalidEmailRoleAccessPolicyException',
  InvalidLambdaResponseException = 'InvalidLambdaResponseException',
  InvalidParameterException = 'InvalidParameterException',
  InvalidPasswordException = 'InvalidPasswordException',
  InvalidSmsRoleAccessPolicyException = 'InvalidSmsRoleAccessPolicyException',
  InvalidSmsRoleTrustRelationshipException = 'InvalidSmsRoleTrustRelationshipException',
  NotAuthorizedException = 'NotAuthorizedException',
  ResourceNotFoundException = 'ResourceNotFoundException',
  TooManyRequestsException = 'TooManyRequestsException',
  UnexpectedLambdaException = 'UnexpectedLambdaException',
  UserLambdaValidationException = 'UserLambdaValidationException',
  UsernameExistsException = 'UsernameExistsException',
}

function transformEnumToObject(enumObject: any) {
  const object: any = {};
  Object.keys(enumObject).forEach(key => {
    object[key] = key;
  });
  return object;
}

export const CognitoErrorType = {
  ...transformEnumToObject(SignUpException),
  ...transformEnumToObject(GetUserException),
  Unknown: 'Unknown',
};

export type CognitoError = {
  message: string;
  type: typeof CognitoErrorType;
};

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

export async function fetchAuthIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSessionFromCognito(); // Note, also refreshes the cognito login if expired there
    if (!session.userSub) {
      throw new Error('Not logged in');
    }
    return session.tokens?.idToken?.toString() ?? null;
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

export function parseCognitoError(error: any): CognitoError {
  const errorName = error.name || String(error).split(':')[0];
  const errorType = CognitoErrorType[errorName] || CognitoErrorType.Unknown;

  switch (errorType) {
    case CognitoErrorType.UserNotConfirmedException:
      return {
        message: 'User not confirmed',
        type: errorType,
      };
    case CognitoErrorType.UserNotFoundException:
      return {
        message: 'User not found',
        type: errorType,
      };
    case CognitoErrorType.NotAuthorizedException:
      return {
        message: 'Wrong password',
        type: errorType,
      };
    case CognitoErrorType.UsernameExistsException:
      return {
        message: 'User already exists',
        type: errorType,
      };
    default:
      return {
        message: 'Unknown error',
        type: errorType,
      };
  }
}

function getRandomString(bytes: number) {
  return randomBytes(bytes).toString('base64');
}
