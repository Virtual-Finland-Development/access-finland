import * as aws from '@pulumi/aws';
import { ListenerArgs } from '@pulumi/aws/alb';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';
import { DomainSetup, LoadBalancerSetup } from '../utils/types';
import { defaultSecurityGroup, defaultSubnetIds, defaultVpcId } from './defaultVpc';
import { createDomainRecordAndCertificate } from './domainSetup';

const {
  tags,
  customHeaderValue,
  cdn: {
    domainConfig: { awsLocalCertsProvider },
  },
} = setup;

export function createLoadBalancer(domainSetup: DomainSetup): LoadBalancerSetup {
  
  // Loadbalancer name can't exceed 32 characters
  const appLoadBalancer = new aws.lb.LoadBalancer(nameResource('alb', 32), {
    internal: false,
    loadBalancerType: 'application',
    enableHttp2: false, // HTTP2 implementation of AWS lb is buggy and to end-user is handled in cloudfront
    subnets: defaultSubnetIds,
    securityGroups: [defaultSecurityGroup.id],
    tags,
  });

  // Target group
  const targetGroup = new aws.lb.TargetGroup(
    nameResource('alb-tg', 32),
    {
      port: 3000, // Nextjs app port
      protocol: 'HTTP',
      targetType: 'ip',
      deregistrationDelay: 0,
      vpcId: defaultVpcId,
    }
  );

  // Listener
  let listenerArgs: Partial<ListenerArgs> = {
    port: 80,
    protocol: 'HTTP',
  };

  if (domainSetup?.loadBalancerDomainName) {
    // Setup loadbalancer HTTPS listener for the custom domain
    const { certificate } = createDomainRecordAndCertificate(
      domainSetup.zone,
      domainSetup?.loadBalancerDomainName,
      appLoadBalancer.dnsName,
      awsLocalCertsProvider
    );
    listenerArgs = {
      port: 443,
      protocol: 'HTTPS',
      certificateArn: certificate.arn,
    };
  }

  const listener = new aws.lb.Listener(nameResource('alb-listener'), {
    loadBalancerArn: appLoadBalancer.arn,
    ...listenerArgs,
    defaultActions: [
      {
        type: 'fixed-response',
        fixedResponse: {
          contentType: 'text/plain',
          messageBody: 'Access denied',
          statusCode: '403',
        },
      },
    ],
  });

  new aws.lb.ListenerRule(nameResource('alb-listener-rule'), {
    listenerArn: listener.arn,
    actions: [
      {
        type: 'forward',
        targetGroupArn: targetGroup.arn,
      },
    ],
    conditions: [
      {
        httpHeader: {
          httpHeaderName: 'X-Custom-Header',
          values: [customHeaderValue],
        },
      },
    ],
  });

  const domainName = domainSetup?.loadBalancerDomainName ? pulumi.interpolate`${domainSetup.loadBalancerDomainName}` : appLoadBalancer.dnsName;
  const url = domainSetup?.loadBalancerDomainName ? pulumi.interpolate`https://${domainSetup.loadBalancerDomainName}` :  pulumi.interpolate`http://${appLoadBalancer.dnsName}`;

  return {
    appLoadBalancer,
    targetGroup,
    domainName: domainName,
    url: url,
  };
}
