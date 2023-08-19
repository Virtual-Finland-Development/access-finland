import * as pulumi from '@pulumi/pulumi';

import { createContentDeliveryNetwork } from './resources/cloudfront';
//import { createDomainSetup } from './resources/domainSetup';  // TODO
import { createECSAutoScaling, createECSCluster } from './resources/ecs';
import { createFargateService } from './resources/fargate';
import { createLoadBalancer } from './resources/loadBalancer';
import { createWebAppFirewallProtection } from './resources/webApplicationFirewall';

// Certfificate and domain setup
//const domainSetup = createDomainSetup(); // TODO
// ECS Cluster
const cluster = createECSCluster();
// Application load balancer
const loadBalancer = createLoadBalancer();
// Cloudfront CDN
const cdn = createContentDeliveryNetwork(loadBalancer);
// Web application firewall
const wafSetup = createWebAppFirewallProtection(cdn);
// ECS Fargate service
const fargateService = createFargateService(loadBalancer, cluster, cdn, wafSetup);
// Auto-scaling policies
createECSAutoScaling(cluster, fargateService);

// Export the URL of load balancer.
export const url = loadBalancer.loadBalancer.dnsName;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
