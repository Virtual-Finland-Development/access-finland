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

// Env/stage override for specific systems --->
const envOverride = environment === 'test' ? 'dev' : environment;
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

// Random value for custom header (for restricted CloudFront -> ALB access)
const customHeaderValue = pulumi.interpolate`${
  new random.RandomUuid(nameResource("uuid")).result
}`;

// CDN custom domain name
const domainName = config.require('domainName');

const setup = {
  organizationName,
  environment,
  projectName,
  tags,
  envOverride,
  externalApis: {
    codesetsEndpoint,
    usersApiEndpoint,
  },
  backendSignKey,
  customHeaderValue,
  cdn: {
    domainName,
    waf: {
      username: config.get('wafUsername'),
      password: config.get('wafPassword'),
    }
  }
};

export default setup;