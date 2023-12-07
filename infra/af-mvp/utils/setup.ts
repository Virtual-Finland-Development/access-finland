/* eslint-disable turbo/no-undeclared-env-vars */
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

const projectConfig = new pulumi.Config();
const organizationName = projectConfig.require('organizationName');
const environment = pulumi.getStack();
const projectName = pulumi.getProject();
const tags = {
  'vfd:project': projectName,
  'vfd:stack': environment,
};

// AWS setup
const awsSetup = new pulumi.Config('aws');

// Env/stage override for specific systems --->
const envOverride = ['mvp-dev'].includes(environment) ? 'dev' : environment;
// <---

const currentStackReference = new pulumi.StackReference(
  `${organizationName}/${projectName}/${environment}`
);

// external apis
const codesetsEndpoint = new pulumi.StackReference(
  `${organizationName}/codesets/${envOverride}`
).getOutput('url');
const usersApiEndpoint = new pulumi.StackReference(
  `${organizationName}/users-api/${envOverride}`
).getOutput('ApplicationUrl');

// Helper function to get a shorter project name
function getShortResourceName(name: string): string {
  const nameParts = name.split('-');
  if (nameParts.length > 1) {
    // Get first letters lowercased
    return nameParts.map(part => part[0].toLowerCase()).join('');
  }
  return name;
}

/**
 * Helper function to name pulumi/aws resources
 *
 * @param resourceName
 * @param maxLength - Max length of the resource name
 * @param pulumiNameHashIncludedInMaxLength - If true, the hash added by pulumi to the resource name is not included to the max length argument calcs
 * @returns
 */
function nameResource(
  resourceName: string,
  maxLength: number = 0,
  pulumiNameHashIncludedInMaxLength: boolean = false
) {
  let resourceNameExtended = `${projectName}-${resourceName}-${environment}`;

  if (maxLength && !pulumiNameHashIncludedInMaxLength) {
    maxLength -= 7; // 7 is the length of the hash added by pulumi to the resource name
  }

  if (maxLength && resourceNameExtended.length > maxLength) {
    const shortProjectName = getShortResourceName(projectName);
    resourceNameExtended = `${shortProjectName}-${resourceName}-${environment}`;

    if (resourceNameExtended.length > maxLength) {
      const shortEnvName = getShortResourceName(environment);
      resourceNameExtended = `${shortProjectName}-${resourceName}-${shortEnvName}`;

      if (resourceNameExtended.length > maxLength) {
        throw new Error(
          `Resource name ${resourceName} exceeds max length of ${maxLength}`
        );
      }
    }
  }
  return resourceNameExtended;
}

// Random value for custom header (for restricted CloudFront -> ALB access)
const customHeaderValue = pulumi.interpolate`${
  new random.RandomUuid(nameResource('uuid')).result
}`;

// CDN custom domain name
const domainConfig = new pulumi.Config('domainSetup');
const domainName = domainConfig.get('domainName');
const domainRootName = domainConfig.get('domainRootName') || domainName;
const loadBalancerDomainName = `loadbalancer.${domainName}`;

// WAF configuration
const wafConfig = new pulumi.Config('waf');

const awsRegion = awsSetup.get('region') || 'us-east-1';
const awsCertsRegionProvider = new aws.Provider(nameResource('cert-region'), {
  region: 'us-east-1',
});
const awsLocalCertsProvider = new aws.Provider(nameResource('cert-local'), {
  region: awsRegion as aws.Region,
});

const setup = {
  currentStackReference,
  organizationName,
  environment,
  projectName,
  tags,
  envOverride,
  externalApis: {
    codesetsEndpoint,
    usersApiEndpoint,
  },
  customHeaderValue,
  cdn: {
    domainConfig: {
      domainName,
      domainRootName,
      loadBalancerDomainName,
      enabled: domainConfig.getBoolean('enabled'),
      awsCertsRegionProvider,
      awsLocalCertsProvider,
    },
    waf: {
      enabled: wafConfig.getBoolean('enabled'),
      username: wafConfig.get('username'),
      password: wafConfig.get('password'),
    },
  },
  awsSetup: {
    region: awsSetup.get('region') || 'us-east-1',
  },
  infrastructureStackName: `${organizationName}/infrastructure/${envOverride}`,
  monitoringStackName: `${organizationName}/cloudwatch-logs-alerts/${envOverride}`,
  nameResource,
};

export default setup;
