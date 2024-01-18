import { Amplify } from 'aws-amplify';
import {
  confirmSignIn as confirmSignInWithCognito,
  fetchAuthSession as fetchAuthSessionFromCognito,
  signIn as signInWithCognito,
  signOut as signOutWithCognito,
  signUp as signUpWithCognito,
} from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { randomBytes } from 'crypto';
import { ApiStorage } from './ApiStorage';

// @see: https://docs.amplify.aws/javascript/build-a-backend/auth/advanced-workflows/

// https://github.com/aws-amplify/amplify-js/blob/main/packages/auth/src/providers/cognito/types/errors.ts
const GetUserException = {
  ForbiddenException: 'ForbiddenException',
  InternalErrorException: 'InternalErrorException',
  InvalidParameterException: 'InvalidParameterException',
  NotAuthorizedException: 'NotAuthorizedException',
  PasswordResetRequiredException: 'PasswordResetRequiredException',
  ResourceNotFoundException: 'ResourceNotFoundException',
  TooManyRequestsException: 'TooManyRequestsException',
  UserNotConfirmedException: 'UserNotConfirmedException',
  UserNotFoundException: 'UserNotFoundException',
};

// https://github.com/aws-amplify/amplify-js/blob/main/packages/auth/src/providers/cognito/types/errors.ts
const SignUpException = {
  CodeDeliveryFailureException: 'CodeDeliveryFailureException',
  InternalErrorException: 'InternalErrorException',
  InvalidEmailRoleAccessPolicyException:
    'InvalidEmailRoleAccessPolicyException',
  InvalidLambdaResponseException: 'InvalidLambdaResponseException',
  InvalidParameterException: 'InvalidParameterException',
  InvalidPasswordException: 'InvalidPasswordException',
  InvalidSmsRoleAccessPolicyException: 'InvalidSmsRoleAccessPolicyException',
  InvalidSmsRoleTrustRelationshipException:
    'InvalidSmsRoleTrustRelationshipException',
  NotAuthorizedException: 'NotAuthorizedException',
  ResourceNotFoundException: 'ResourceNotFoundException',
  TooManyRequestsException: 'TooManyRequestsException',
  UnexpectedLambdaException: 'UnexpectedLambdaException',
  UserLambdaValidationException: 'UserLambdaValidationException',
  UsernameExistsException: 'UsernameExistsException',
};

export const CognitoErrorTypes = {
  ...SignUpException,
  ...GetUserException,
  CodeMismatchException: 'CodeMismatchException',
  MaxCodeAttemptsExceededException: 'MaxCodeAttemptsExceededException',
  Unknown: 'Unknown',
} as const;

class CodeMismatchException extends Error {
  name = 'CodeMismatchException';
}
class MaxCodeAttemptsExceededException extends Error {
  name = 'MaxCodeAttemptsExceededException';
}

export type CognitoErrorType =
  (typeof CognitoErrorTypes)[keyof typeof CognitoErrorTypes];

export type CognitoError = {
  message: string;
  type: CognitoErrorType;
};

function getRandomString(bytes: number) {
  return randomBytes(bytes).toString('base64');
}

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

export const authStore = new ApiStorage('/api/auth/system/session');

// @see: https://docs.amplify.aws/javascript/build-a-backend/auth/manage-user-session/
cognitoUserPoolsTokenProvider.setKeyValueStorage(authStore);

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
  await signInWithCognito({
    username: email,
    options: {
      authFlowType: 'CUSTOM_WITHOUT_SRP',
    },
  });
}

export async function signUp(email: string) {
  await signUpWithCognito({
    username: email,
    password: getRandomString(30), // This is not used but require a value
    options: {
      userAttributes: {
        email,
      },
      autoSignIn: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
    },
  });
}

export async function confirmSignIn(code: string) {
  try {
    const { isSignedIn } = await confirmSignInWithCognito({
      challengeResponse: code,
    });

    if (!isSignedIn) {
      throw new CodeMismatchException();
    }
  } catch (error) {
    // Transform the not authorized exception (3rd failed code input try) to a more user friendly message
    if (
      !(error instanceof CodeMismatchException) &&
      parseCognitoError(error).type === CognitoErrorTypes.NotAuthorizedException
    ) {
      throw new MaxCodeAttemptsExceededException();
    }
    throw error;
  }
}

export async function signOut() {
  await signOutWithCognito();
}

export function parseCognitoError(error: any): CognitoError {
  const errorName = error.name || String(error).split(':')[0];
  const errorType = CognitoErrorTypes[errorName] || CognitoErrorTypes.Unknown;

  switch (errorType) {
    case CognitoErrorTypes.UserNotConfirmedException:
      return {
        message: 'User not confirmed',
        type: errorType,
      };
    case CognitoErrorTypes.UserNotFoundException:
      return {
        message: 'User not found',
        type: errorType,
      };
    case CognitoErrorTypes.NotAuthorizedException:
      return {
        message: 'Unauthorized',
        type: errorType,
      };
    case CognitoErrorTypes.UsernameExistsException:
      return {
        message: 'User already exists',
        type: errorType,
      };
    case CognitoErrorTypes.UserLambdaValidationException:
      if (error.message.includes('UserNotFoundException')) {
        return {
          message: 'User not found',
          type: CognitoErrorTypes.UserNotFoundException,
        };
      }
    case CognitoErrorTypes.CodeMismatchException:
      return {
        message: 'Incorrect code entered',
        type: errorType,
      };
    case CognitoErrorTypes.MaxCodeAttemptsExceededException:
      return {
        message: 'Too many attempts, try again later',
        type: errorType,
      };
  }

  return {
    message: 'Unknown error',
    type: errorType,
  };
}
