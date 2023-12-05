import * as pulumi from '@pulumi/pulumi';
import {
  createContentDeliveryNetwork,
  updateContentDeliveryNetwork,
} from './resources/cloudfront';
import { createDomainSetup } from './resources/domainSetup';
import { createECSAutoScaling, createECSCluster } from './resources/ecs';
import { createFargateService } from './resources/fargate';
import {
  createLoadBalancer,
  updateLoadBalancer,
} from './resources/loadBalancer';
import { createWebAppFirewallProtection } from './resources/webApplicationFirewall';

// ECS Cluster
const cluster = createECSCluster();
// Application load balancer
let loadBalancerSetup = createLoadBalancer();
// Web application firewall
const wafSetup = createWebAppFirewallProtection();
// Cloudfront CDN
const cdnSetup = createContentDeliveryNetwork(
  loadBalancerSetup,
  wafSetup?.webApplicationFirewall
);

// Setup domain and update alb and cdn
const domainSetup = createDomainSetup(cdnSetup.cdn);
const updatedLb = updateLoadBalancer(loadBalancerSetup, domainSetup);
const updatedCdn = updateContentDeliveryNetwork(
  cdnSetup.cdn,
  loadBalancerSetup,
  domainSetup
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

// Export url actually used by the application
export const url = pulumi.interpolate`https://${updatedCdn.domainName}`;
// Export load balancer url.
export const lbUrl = updatedLb.url;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${updatedCdn.cdn.domainName}`;

// Outputs for the monitoring dashboard
export const CloudFrontDistributionId = cdnSetup.cdn.id;
export const FargateServiceName = fargateService.service.name;
export const EcsClusterName = cluster.name;
export const AppLoadBalancerArn = updatedLb.appLoadBalancer.arn;
export const CognitoUserPoolId = wafSetup?.userPool.id;
export const CongitoUserPoolClientId = wafSetup?.userPoolClient.id;
