/* eslint-disable turbo/no-undeclared-env-vars */
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

const organizationName = pulumi.getOrganization();
const environment = pulumi.getStack();
const projectName = pulumi.getProject();
const tags = {
  'vfd:project': projectName,
  'vfd:stack': environment,
};
const config = new pulumi.Config();
const githubAccessToken =
  config.get('githubAccessToken') || process.env.GITHUB_ACCESS_TOKEN || '';

// AWS setup
const awsSetup = new pulumi.Config('aws');

// @temporary overrides for testing --->
const envOverride = 'dev';
const amplifyBranchOverride = 'aws-amplify';
// <---

// external apis
const codesetsEndpoint = new pulumi.StackReference(
  `${organizationName}/codesets/${envOverride}`
).getOutput('url');
const usersApiEndpoint = new pulumi.StackReference(
  `${organizationName}/users-api/${envOverride}`
).getOutput('ApplicationUrl');

// helper function to name pulumi/aws resources
export function nameResource(resourceName: string) {
  return `${projectName}-${resourceName}-${environment}`;
}

// Random value for secret sign key
const backendSignKey = pulumi.interpolate`${
  new random.RandomPassword(nameResource('backendSignKey'), {
    length: 32,
  }).result
}`;

const setup = {
  organizationName,
  environment,
  projectName,
  tags,
  githubAccessToken,
  envOverride,
  amplifyBranchOverride,
  externalApis: {
    codesetsEndpoint,
    usersApiEndpoint,
  },
  backendSignKey,
  awsSetup: {
    region: awsSetup.get('region') || 'us-east-1',
  }
};

export default setup;
