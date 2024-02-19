/* eslint-disable turbo/no-undeclared-env-vars */
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

const organizationName = pulumi.getOrganization();
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

let currentStackReference: pulumi.StackReference;
function getCurrentStackReference() {
  if (!currentStackReference) {
    currentStackReference = new pulumi.StackReference(
      `${organizationName}/${projectName}/${environment}`
    );
  }
  return currentStackReference;
}

// external apis
let codesetsEndpoint: pulumi.Output<string>;
function getCodesetsEndpoint() {
  if (!codesetsEndpoint) {
    codesetsEndpoint = new pulumi.StackReference(
      `${organizationName}/codesets/${envOverride}`
    ).getOutput('url') as pulumi.Output<string>;
  }
  return codesetsEndpoint;
}

let usersApiEndpoint: pulumi.Output<string>;
function getUsersApiEndpoint() {
  if (!usersApiEndpoint) {
    usersApiEndpoint = new pulumi.StackReference(
      `${organizationName}/users-api/${envOverride}`
    ).getOutput('ApplicationUrl') as pulumi.Output<string>;
  }
  return usersApiEndpoint;
}

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
export function nameResource(
  resourceName: string,
  maxLength: number = 0,
  pulumiNameHashIncludedInMaxLength: boolean = false
) {
  let resourceNameExtended = `${projectName}-${resourceName}-${environment}`;

  if (maxLength && !pulumiNameHashIncludedInMaxLength) {
    maxLength = maxLength - 8; // 8 is the length of the hash + a dash added by pulumi to the resource name
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

export async function isInitialDeployment() {
  return !Boolean(await getCurrentStackReference().getOutputValue('cdnURL'));
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
let awsCertsRegionProvider: aws.Provider;
function getAwsCertsRegionProvider() {
  if (!awsCertsRegionProvider) {
    awsCertsRegionProvider = new aws.Provider(nameResource('cert-region'), {
      region: 'us-east-1', // Certificates used by global resources (cdn etc) are only available in us-east-1
    });
  }
  return awsCertsRegionProvider;
}

let awsLocalCertsProvider: aws.Provider;
function getAwsLocalCertsProvider() {
  if (!awsLocalCertsProvider) {
    awsLocalCertsProvider = new aws.Provider(
      nameResource('local-cert-region'),
      {
        region: awsRegion as aws.Region,
      }
    );
  }
  return awsLocalCertsProvider;
}

// Email setup
const sesConfig = new pulumi.Config('ses');

const setup = {
  getCurrentStackReference,
  organizationName,
  environment,
  projectName,
  tags,
  envOverride,
  externalApis: {
    getCodesetsEndpoint,
    getUsersApiEndpoint,
  },
  customHeaderValue,
  cdn: {
    domainConfig: {
      domainName,
      domainRootName,
      loadBalancerDomainName,
      enabled: domainConfig.getBoolean('enabled'),
      getAwsCertsRegionProvider,
      getAwsLocalCertsProvider,
    },
    waf: {
      enabled: wafConfig.getBoolean('enabled'),
      username: wafConfig.get('username'),
      password: wafConfig.get('password'),
      customDomain: {
        cognitoSubDomain: 'auth',
        applicationSubDomain: 'virtualfinland',
      },
    },
  },
  awsSetup: {
    region: awsSetup.get('region') || 'us-east-1',
  },
  infrastructureStackName: `${organizationName}/infrastructure/${envOverride}`,
  monitoringStackName: `${organizationName}/cloudwatch-logs-alerts/${envOverride}`,
  ses: {
    fromAddress: sesConfig.require('fromAddress'),
  },
};

export default setup;
