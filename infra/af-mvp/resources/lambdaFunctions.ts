import * as aws from '@pulumi/aws';
import setup, { nameResource } from '../utils/setup';
import createAuthChallenge from './lambda-functions/createAuthChallenge';
import defineAuthChallenge from './lambda-functions/defineAuthChallenge';
import postAuthentication from './lambda-functions/postAuthentication';
import preSignUp from './lambda-functions/preSignUp';
import verifyAuthChallenge from './lambda-functions/verifyAuthChallenge';

const { tags } = setup;

export function createDefineAuthChallengeLambda() {
  const execRole = new aws.iam.Role(nameResource('defineAuthChallengeRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  // Attach basic execution policy
  new aws.iam.RolePolicyAttachment(
    nameResource('defineAuthChallengePolicyAttachment'),
    {
      role: execRole,
      policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
    }
  );

  return new aws.lambda.CallbackFunction(nameResource('defineAuthChallenge'), {
    callback: defineAuthChallenge,
    role: execRole.arn,
    runtime: 'nodejs18.x',
    timeout: 5,
    memorySize: 128,
    environment: {
      variables: {
        LOG_LEVEL: 'INFO',
      },
    },
    tags,
  });
}

export function createVerifyAuthChallengeResponseLambda() {
  const execRole = new aws.iam.Role(
    nameResource('verifyAuthChallengeResponseRole'),
    {
      assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: 'lambda.amazonaws.com',
      }),
      tags,
    }
  );

  // Attach basic execution policy
  new aws.iam.RolePolicyAttachment(
    nameResource('verifyAuthChallengeResponsePolicyAttachment'),
    {
      role: execRole,
      policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
    }
  );

  return new aws.lambda.CallbackFunction(
    nameResource('verifyAuthChallengeResponse'),
    {
      callback: verifyAuthChallenge,
      role: execRole.arn,
      runtime: 'nodejs18.x',
      timeout: 5,
      memorySize: 128,
      environment: {
        variables: {
          LOG_LEVEL: 'INFO',
        },
      },
      tags,
    }
  );
}

export function createCreateAuthChallengeLambda() {
  const execRole = new aws.iam.Role(nameResource('createAuthChallengeRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  // Attach basic execution policy
  new aws.iam.RolePolicyAttachment(
    nameResource('createAuthChallengePolicyAttachment'),
    {
      role: execRole,
      policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
    }
  );

  // Allow sending emails
  new aws.iam.RolePolicyAttachment(
    nameResource('createAuthChallengeSesPolicyAttachment'),
    {
      role: execRole,
      policyArn: aws.iam.ManagedPolicies.AmazonSESFullAccess,
    }
  );

  return new aws.lambda.CallbackFunction(nameResource('createAuthChallenge'), {
    callback: createAuthChallenge,
    role: execRole.arn,
    runtime: 'nodejs18.x',
    timeout: 5,
    memorySize: 128,
    environment: {
      variables: {
        LOG_LEVEL: 'INFO',
        SES_FROM_ADDRESS: 'no-reply@dev.accessfinland.dev', // @TODO
      },
    },
    tags,
  });
}

export function createPreSignUpLambda() {
  const execRole = new aws.iam.Role(nameResource('preSignUpRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  // Attach basic execution policy
  new aws.iam.RolePolicyAttachment(nameResource('preSignUpPolicyAttachment'), {
    role: execRole,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
  });

  return new aws.lambda.CallbackFunction(nameResource('preSignUp'), {
    callback: preSignUp,
    role: execRole.arn,
    runtime: 'nodejs18.x',
    timeout: 5,
    memorySize: 128,
    environment: {
      variables: {
        LOG_LEVEL: 'INFO',
      },
    },
    tags,
  });
}

export function createPostAuthenticationLambda() {
  const execRole = new aws.iam.Role(nameResource('postAuthenticationRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  // Attach basic execution policy
  new aws.iam.RolePolicyAttachment(
    nameResource('postAuthenticationPolicyAttachment'),
    {
      role: execRole,
      policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
    }
  );

  return new aws.lambda.CallbackFunction(nameResource('postAuthentication'), {
    callback: postAuthentication,
    role: execRole.arn,
    runtime: 'nodejs18.x',
    timeout: 5,
    memorySize: 128,
    environment: {
      variables: {
        LOG_LEVEL: 'INFO',
      },
    },
    tags,
  });
}
