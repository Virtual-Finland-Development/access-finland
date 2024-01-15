import * as aws from '@pulumi/aws';
import { UserPool, UserPoolClient } from '@pulumi/aws/cognito';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';
import { CdnSetup } from '../utils/types';
import { generateBackendSecretKeyPair } from './systemsManager';

const {
  tags,
  envOverride,
  externalApis: { codesetsEndpoint, usersApiEndpoint },
} = setup;

export function createContainerImage(
  cdnSetup: CdnSetup,
  loginSystem: {
    userPool: UserPool;
    userPoolClient: UserPoolClient;
  }
) {
  const dataspaceConfig = new pulumi.Config('dataspace');

  // Dependencies
  generateBackendSecretKeyPair();

  // ECR repository
  const repository = new awsx.ecr.Repository(nameResource('ecr-repo'), {
    tags,
    forceDelete: true,
  });

  // ECR Docker image
  const image = new awsx.ecr.Image(nameResource('mvp-image'), {
    repositoryUrl: repository.url,
    path: '../../', // path to a directory to use for the Docker build context (root of the repo)
    dockerfile: '../../apps/af-mvp/Dockerfile', // dockerfile may be used to override the default Dockerfile name and/or location
    extraOptions: ['--platform', 'linux/amd64'],
    args: {
      NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
      NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
      NEXT_PUBLIC_STAGE: envOverride,
      DATASPACE_PRODUCT_GATEWAY_BASE_URL: dataspaceConfig.require('gatewayUrl'),
      DATASPACE_DEFAULT_DATA_SOURCE:
        dataspaceConfig.require('defaultDataSource'),
      DATASPACE_DEFAULT_SCHEMA_VERSION: dataspaceConfig.require(
        'defaultSchemaVersion'
      ),
      FRONTEND_ORIGIN_URI: pulumi.interpolate`https://${cdnSetup.domainName}`,
      NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ID: loginSystem.userPool.id,
      NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_CLIENT_ID: loginSystem.userPoolClient.id,
      NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ENDPOINT: pulumi.interpolate`https://${loginSystem.userPool.endpoint}`,
    },
  });

  return image;
}
