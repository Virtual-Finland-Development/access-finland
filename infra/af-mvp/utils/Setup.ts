/* eslint-disable turbo/no-undeclared-env-vars */
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

export class StaticSetup {
  public static projectName: string = pulumi.getProject();
  public static environment: string = pulumi.getStack();
  public static organizationName: string = new pulumi.Config().require(
    'organizationName'
  );
  public static currentStackReference: pulumi.StackReference =
    new pulumi.StackReference(
      `${StaticSetup.organizationName}/${StaticSetup.projectName}/${StaticSetup.environment}`
    );

  public static async IsDeployedOnce() {
    return Boolean(
      await StaticSetup.currentStackReference.getOutputValue('cdnURL')
    );
  }
}

class Setup {
  public projectName = StaticSetup.projectName;
  public tags: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
  public environment = StaticSetup.environment;
  public envOverride: string;
  public organizationName = StaticSetup.organizationName;
  public currentStackReference = StaticSetup.currentStackReference;
  public IsDeployedOnce = StaticSetup.IsDeployedOnce;

  public externalApis: {
    codesetsEndpoint: pulumi.Output<any>;
    usersApiEndpoint: pulumi.Output<any>;
  };
  public customHeaderValue: pulumi.Output<string>;
  public cdn: {
    domainConfig: {
      domainName: string | undefined;
      domainRootName: string | undefined;
      loadBalancerDomainName: string | undefined;
      enabled: boolean;
      awsCertsRegionProvider: aws.Provider;
      awsLocalCertsProvider: aws.Provider;
    };
    waf: {
      enabled: boolean;
      username?: string;
      password?: string;
    };
  };
  public awsSetup: {
    region: string;
  };

  public infrastructureStackName: string;
  public monitoringStackName: string;
  public protect = {
    domainZone: true, // Keep the zone from being destroyed
    cognito: true, // Keep the cognito user pool from being destroyed
  };

  constructor() {
    this.tags = {
      'vfd:project': this.projectName,
      'vfd:stack': this.environment,
    };

    // AWS setup
    const awsSetup = new pulumi.Config('aws');

    // Env/stage override for specific systems --->
    this.envOverride = ['mvp-dev'].includes(this.environment)
      ? 'dev'
      : this.environment;
    // <---

    // Unprotect some resources in test environment
    if (this.environment === 'test') {
      this.protect.domainZone = false;
      this.protect.cognito = false;
    }

    this.externalApis = {
      codesetsEndpoint: new pulumi.StackReference(
        `${this.organizationName}/codesets/${this.envOverride}`
      ).getOutput('url'),
      usersApiEndpoint: new pulumi.StackReference(
        `${this.organizationName}/users-api/${this.envOverride}`
      ).getOutput('ApplicationUrl'),
    };

    // Random value for custom header (for restricted CloudFront -> ALB access)
    this.customHeaderValue = pulumi.interpolate`${
      new random.RandomUuid(this.nameResource('uuid')).result
    }`;

    // CDN custom domain name
    const domainConfig = new pulumi.Config('domainSetup');
    const domainName = domainConfig.get('domainName');
    const domainRootName = domainConfig.get('domainRootName') || domainName;
    const loadBalancerDomainName = `loadbalancer.${domainName}`;

    // WAF configuration
    const wafConfig = new pulumi.Config('waf');
    const awsRegion = awsSetup.get('region') || 'us-east-1';
    const awsCertsRegionProvider = new aws.Provider(
      this.nameResource('cert-region'),
      {
        region: 'us-east-1',
      }
    );
    const awsLocalCertsProvider = new aws.Provider(
      this.nameResource('cert-local'),
      {
        region: awsRegion as aws.Region,
      }
    );

    this.cdn = {
      domainConfig: {
        domainName,
        domainRootName,
        loadBalancerDomainName,
        enabled: domainConfig.getBoolean('enabled') || false,
        awsCertsRegionProvider,
        awsLocalCertsProvider,
      },
      waf: {
        enabled: wafConfig.getBoolean('enabled') || false,
        username: wafConfig.get('username'),
        password: wafConfig.get('password'),
      },
    };

    this.awsSetup = {
      region: awsSetup.get('region') || 'us-east-1',
    };

    this.infrastructureStackName = `${this.organizationName}/infrastructure/${this.envOverride}`;
    this.monitoringStackName = `${this.organizationName}/cloudwatch-logs-alerts/${this.envOverride}`;
  }

  /**
   * Helper function to name pulumi/aws resources
   *
   * @param resourceName
   * @param maxLength - Max length of the resource name
   * @param pulumiNameHashIncludedInMaxLength - If true, the hash added by pulumi to the resource name is not included to the max length argument calcs
   * @returns
   */
  nameResource(
    resourceName: string,
    maxLength: number = 0,
    pulumiNameHashIncludedInMaxLength: boolean = false
  ) {
    let resourceNameExtended = `${this.projectName}-${resourceName}-${this.environment}`;

    if (maxLength && !pulumiNameHashIncludedInMaxLength) {
      maxLength -= 7; // 7 is the length of the hash added by pulumi to the resource name
    }

    if (maxLength && resourceNameExtended.length > maxLength) {
      const shortProjectName = this.getShortResourceName(this.projectName);
      resourceNameExtended = `${shortProjectName}-${resourceName}-${this.environment}`;

      if (resourceNameExtended.length > maxLength) {
        const shortEnvName = this.getShortResourceName(this.environment);
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

  // Helper function to get a shorter project name
  getShortResourceName(name: string): string {
    const nameParts = name.split('-');
    if (nameParts.length > 1) {
      // Get first letters lowercased
      return nameParts.map(part => part[0].toLowerCase()).join('');
    }
    return name;
  }
}

export default Setup;
