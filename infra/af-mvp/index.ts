import * as pulumi from '@pulumi/pulumi';
import { createContentDeliveryNetwork } from './resources/cloudfront';
import { createDomainSetup } from './resources/domainSetup';
import { createECSAutoScaling, createECSCluster } from './resources/ecs';
import { createFargateService } from './resources/fargate';
import { createLoadBalancer } from './resources/loadBalancer';
import { createWebAppFirewallProtection } from './resources/webApplicationFirewall';

// Domain setup
const domainSetup = createDomainSetup();
// ECS Cluster
const cluster = createECSCluster();
// Application load balancer
const loadBalancer = createLoadBalancer(domainSetup);
// Web application firewall
const wafSetup = createWebAppFirewallProtection();
// Cloudfront CDN
const cdnSetup = createContentDeliveryNetwork(
  loadBalancer,
  domainSetup,
  wafSetup?.webApplicationFirewall
);
// ECS Fargate service
const fargateService = createFargateService(
  loadBalancer,
  cluster,
  cdnSetup,
  wafSetup
);
// Auto-scaling policies
createECSAutoScaling(cluster, fargateService);

// Export url actually used by the application
export const url = pulumi.interpolate`https://${cdnSetup.domainName}`;
// Export the URL of load balancer.
export const lbUrl = loadBalancer.loadBalancer.dnsName;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${cdnSetup.cdn.domainName}`;
