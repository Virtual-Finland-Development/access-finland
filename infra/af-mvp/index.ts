import * as pulumi from '@pulumi/pulumi';
import { createContentDeliveryNetwork } from './resources/cloudfront';
import { createDomainSetup } from './resources/domainSetup';
import { createECSAutoScaling, createECSCluster } from './resources/ecs';
import { createFargateService } from './resources/fargate';
import { createLoadBalancer } from './resources/loadBalancer';
import { createWebAppFirewallProtection } from './resources/webApplicationFirewall';
import setup, { isInitialDeployment } from './utils/setup';

const {
  cdn: { domainConfig },
} = setup;

export = async () => {
  const initialDeployment = await isInitialDeployment();
  // Domain setup
  const domainSetup = await createDomainSetup();
  // ECS Cluster
  const cluster = createECSCluster();
  // Application load balancer
  const loadBalancerSetup = createLoadBalancer(domainSetup);
  // Web application firewall
  const wafSetup = await createWebAppFirewallProtection();
  // Cloudfront CDN
  const cdnSetup = createContentDeliveryNetwork(
    loadBalancerSetup,
    domainSetup,
    wafSetup?.webApplicationFirewall
  );
  // ECS Fargate service
  const fargateService = createFargateService(
    loadBalancerSetup,
    cluster,
    cdnSetup,
    wafSetup
  );
  // Auto-scaling policies
  createECSAutoScaling(cluster, fargateService);

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
    initialDomainCheckRequired: initialDeployment && domainConfig.enabled,
  };
};
