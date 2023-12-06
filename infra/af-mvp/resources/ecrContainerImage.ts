import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { ISetup } from '../utils/types';
import { generateBackendSecretKeyPair } from './systemsManager';

export function createContainerImage(
  setup: ISetup,
  cdnSetup: {
    cdn: aws.cloudfront.Distribution;
    domainName: pulumi.Output<string>;
  }
) {
  const dataspaceConfig = new pulumi.Config('dataspace');

  // Dependencies
  generateBackendSecretKeyPair(setup);

  // ECR repository
  const repository = new awsx.ecr.Repository(setup.nameResource('ecr-repo'), {
    tags: setup.tags,
    forceDelete: true,
  });

  // ECR Docker image
  const image = new awsx.ecr.Image(setup.nameResource('mvp-image'), {
    repositoryUrl: repository.url,
    path: '../../', // path to a directory to use for the Docker build context (root of the repo)
    dockerfile: '../../apps/af-mvp/Dockerfile', // dockerfile may be used to override the default Dockerfile name and/or location
    extraOptions: ['--platform', 'linux/amd64'],
    args: {
      NEXT_PUBLIC_CODESETS_BASE_URL: setup.externalApis.codesetsEndpoint,
      NEXT_PUBLIC_USERS_API_BASE_URL: setup.externalApis.usersApiEndpoint,
      NEXT_PUBLIC_STAGE: setup.envOverride,
      DATASPACE_PRODUCT_GATEWAY_BASE_URL: dataspaceConfig.require('gatewayUrl'),
      DATASPACE_DEFAULT_DATA_SOURCE:
        dataspaceConfig.require('defaultDataSource'),
      DATASPACE_DEFAULT_SCHEMA_VERSION: dataspaceConfig.require(
        'defaultSchemaVersion'
      ),
      FRONTEND_ORIGIN_URI: pulumi.interpolate`https://${cdnSetup.domainName}`,
    },
  });

  return image;
}
