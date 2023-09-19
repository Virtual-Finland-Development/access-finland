import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  envOverride,
  externalApis: { codesetsEndpoint, usersApiEndpoint },
  backendSignKey,
} = setup;

export function createContainerImage(cdnSetup: {
  cdn: aws.cloudfront.Distribution;
  domainName: pulumi.Output<string>;
}) {
  const testbedConfig = new pulumi.Config('testbed');

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
      BACKEND_SECRET_SIGN_KEY: backendSignKey,
      NEXT_PUBLIC_STAGE: envOverride,
      /* TESTBED_PRODUCT_GATEWAY_BASE_URL:
        process.env.TESTBED_PRODUCT_GATEWAY_BASE_URL ||
        testbedConfig.require('gatewayUrl'), */
      TESTBED_PRODUCT_GATEWAY_BASE_URL: pulumi.interpolate`${usersApiEndpoint}/productizer`,
      TESTBED_DEFAULT_DATA_SOURCE:
        process.env.TESTBED_DEFAULT_DATA_SOURCE ||
        testbedConfig.require('defaultDataSource'),
      FRONTEND_ORIGIN_URI: pulumi.interpolate`https://${cdnSetup.domainName}`,
    },
  });

  return image;
}
