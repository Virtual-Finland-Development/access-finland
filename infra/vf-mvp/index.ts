import * as pulumi from '@pulumi/pulumi';

import { createContentDeliveryNetwork } from './resources/cloudfront';
import { createFargateService } from './resources/fargate';
import { createLoadBalancer } from './resources/loadBalancer';

// Application load balancer
const loadBalancer = createLoadBalancer();
// Cloudfront CDN
const cdn = createContentDeliveryNetwork(loadBalancer);
// ECS Fargate service
createFargateService(loadBalancer, cdn);

// Export the URL of load balancer.
export const url = loadBalancer.loadBalancer.dnsName;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
