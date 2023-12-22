import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const { tags } = setup;

export function createDefineAuthChallengeLambda() {
  const execRole = new aws.iam.Role(nameResource('defineAuthChallengeRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  return new aws.lambda.Function(nameResource('defineAuthChallenge'), {
    code: new pulumi.asset.AssetArchive({
      './': new pulumi.asset.FileArchive(
        './node_modules/amazon-cognito-passwordless-auth/dist/cdk/custom-auth'
      ),
    }),
    handler: 'define-auth-challenge.handler',
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
  const execRole = new aws.iam.Role(nameResource('verifyAuthChallengeRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  return new aws.lambda.Function(nameResource('verifyAuthChallengeResponse'), {
    code: new pulumi.asset.AssetArchive({
      './': new pulumi.asset.FileArchive(
        './node_modules/amazon-cognito-passwordless-auth/dist/cdk/custom-auth'
      ),
    }),
    handler: 'verify-auth-challenge-response.handler',
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

export function createCreateAuthChallengeLambda() {
  const execRole = new aws.iam.Role(nameResource('createAuthChallengeRole'), {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
    tags,
  });

  return new aws.lambda.Function(nameResource('createAuthChallenge'), {
    code: new pulumi.asset.AssetArchive({
      './': new pulumi.asset.FileArchive(
        './node_modules/amazon-cognito-passwordless-auth/dist/cdk/custom-auth'
      ),
    }),
    handler: 'create-auth-challenge.handler',
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
