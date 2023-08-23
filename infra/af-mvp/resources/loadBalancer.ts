import * as aws from '@pulumi/aws';
import { ListenerArgs } from '@pulumi/aws/alb';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';
import { DomainSetup, LoadBalancerSetup } from '../utils/types';
import { createDomainCnameRecord } from './domainSetup';

const {
  tags,
  customHeaderValue,
  cdn: {
    domainConfig: { awsLocalCertsProvider },
  },
} = setup;

export function createLoadBalancer(domainSetup: DomainSetup): LoadBalancerSetup {
  // Loadbalancer name can't exceed 32 characters
  const appLoadBalancer = new awsx.lb.ApplicationLoadBalancer(
    nameResource('alb', 32),
    {
      tags,
      defaultTargetGroup: {
        deregistrationDelay: 0,
        port: 3000,
      },
      enableHttp2: false, // HTTP2 implementation of AWS lb is buggy and to end-user is handled in cloudfront
    }
  );

  // Listener
  let listenerArgs: Partial<ListenerArgs> = {
    port: 80,
    protocol: 'HTTP',
  };

  if (domainSetup?.loadBalancerDomainName) {
    // Setup loadbalancer HTTPS listener for the custom domain
    const loadBalancerCert = createDomainCnameRecord(
      domainSetup.zone,
      domainSetup?.loadBalancerDomainName,
      appLoadBalancer.loadBalancer.dnsName,
      awsLocalCertsProvider
    );
    listenerArgs = {
      port: 443,
      protocol: 'HTTPS',
      certificateArn: loadBalancerCert.arn,
    };
  }

  const listener = new aws.lb.Listener(nameResource('alb-listener'), {
    loadBalancerArn: appLoadBalancer.loadBalancer.arn,
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
        targetGroupArn: appLoadBalancer.defaultTargetGroup.arn,
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

  const domainName = domainSetup?.loadBalancerDomainName ? pulumi.interpolate`${domainSetup.loadBalancerDomainName}` : appLoadBalancer.loadBalancer.dnsName;
  const url = domainSetup?.loadBalancerDomainName ? pulumi.interpolate`https://${domainSetup.loadBalancerDomainName}` :  pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}`;

  return {
    appLoadBalancer,
    domainName: domainName,
    url: url,
  };
}
