import * as pulumi from '@pulumi/pulumi';
import * as automation from '@pulumi/pulumi/automation';
import yargs from 'yargs';
import { createContentDeliveryNetwork } from './resources/cloudfront';
import { createDomainSetup } from './resources/domainSetup';
import { createECSAutoScaling, createECSCluster } from './resources/ecs';
import { createFargateService } from './resources/fargate';
import { createLoadBalancer } from './resources/loadBalancer';
import { createWebAppFirewallProtection } from './resources/webApplicationFirewall';
import { default as Setup } from './utils/setup';
import { ISetup } from './utils/types';

const args = process.argv.slice(2);
const argv = yargs(args).option('destroy', {
  boolean: true,
  default: false,
}).argv as { destroy?: boolean };
const isDestroyCommand = argv.destroy;

async function main(setup: ISetup) {
  // Domain setup
  const domainSetup = await createDomainSetup(setup);

  // ECS Cluster
  const cluster = createECSCluster(setup);

  // Application load balancer
  const loadBalancerSetup = createLoadBalancer(setup, domainSetup);

  // Web application firewall
  const wafSetup = await createWebAppFirewallProtection(setup);

  // Cloudfront CDN
  const cdnSetup = createContentDeliveryNetwork(
    setup,
    loadBalancerSetup,
    domainSetup,
    wafSetup?.webApplicationFirewall
  );

  // ECS Fargate service
  const fargateService = createFargateService(
    setup,
    loadBalancerSetup,
    cluster,
    cdnSetup,
    wafSetup
  );

  // Auto-scaling policies
  createECSAutoScaling(setup, cluster, fargateService);

  return {
    url: pulumi.interpolate`https://${cdnSetup.domainName}`, // url actually used by the application
    lbUrl: loadBalancerSetup.url, // load balancer url
    cdnURL: pulumi.interpolate`https://${cdnSetup.cdn.domainName}`, // CloudFront url
    // Outputs for the monitoring dashboard
    CloudFrontDistributionId: cdnSetup.cdn.id,
    FargateServiceName: fargateService.service.name,
    EcsClusterName: cluster.name,
    AppLoadBalancerArn: loadBalancerSetup.appLoadBalancer.arn,
    CognitoUserPoolId: wafSetup?.userPool.id,
    CongitoUserPoolClientId: wafSetup?.userPoolClient.id,
  };
}

export = async () => {
  const stack = await automation.LocalWorkspace.createOrSelectStack(
    {
      stackName: `${Setup.organizationName}/${Setup.environment}`,
      projectName: Setup.projectName,
      program: async () => {
        return main(Setup);
      },
    },
    {
      workDir: __dirname, // Magic variable that resolves to the directory of this file
    }
  );

  if (isDestroyCommand) {
    await stack.destroy();
    process.exit(0);
  } else {
    const stackDeployedOnce = Boolean(
      await Setup.currentStackReference.getOutputValue('cdnURL')
    );

    // Print outputs only with the last deployment
    const onOutput = stackDeployedOnce ? console.info : undefined;

    // Deploy the stack
    let response = await stack.up({ onOutput });
    if (!stackDeployedOnce) {
      response = await stack.up({ onOutput }); // Run twice to ensure all resources are created
    }
    return response.outputs;
  }
};
