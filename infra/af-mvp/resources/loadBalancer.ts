import * as aws from '@pulumi/aws';
import { ListenerArgs } from '@pulumi/aws/alb';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';
import { DomainSetup, LoadBalancerSetup } from '../utils/types';
import { defaultSubnetIds, defaultVpcId } from './defaultVpc';
import { createDomainRecordAndCertificate } from './domainSetup';

const {
  tags,
  customHeaderValue,
  cdn: {
    domainConfig: { awsLocalCertsProvider },
  },
} = setup;

export function updateLoadBalancer(
  lbSetup: LoadBalancerSetup,
  domainSetup: DomainSetup
) {
  return pulumi
    .all([
      lbSetup.appLoadBalancer.id,
      lbSetup.loadBalancerSecurityGroup.id,
      lbSetup.listener.arn,
    ])
    .apply(([albId, securityGroupId, listenerArn]) => {
      const { ingress, egress } = createSecurityGroupRules(domainSetup);
      const loadBalancerSecurityGroup = aws.ec2.SecurityGroup.get(
        nameResource('alb-sg-update'),
        securityGroupId,
        {
          ingress: ingress,
          egress: egress,
        }
      );

      const appLoadBalancer = aws.lb.LoadBalancer.get(
        nameResource('alb-update', 32),
        albId
      );

      const listenerArgs = createListenerArgs(appLoadBalancer, domainSetup);
      const listener = aws.lb.Listener.get(
        nameResource('alb-listener-update'),
        listenerArn,
        listenerArgs
      );

      const { domainName, url } = createAlbUris(appLoadBalancer, domainSetup);

      return {
        appLoadBalancer,
        targetGroup: lbSetup.targetGroup,
        loadBalancerSecurityGroup,
        listener,
        domainName,
        url,
      };
    });
}

export function createLoadBalancer(
  domainSetup?: DomainSetup
): LoadBalancerSetup {
  const { ingress, egress } = createSecurityGroupRules(domainSetup);

  // Security group
  const loadBalancerSecurityGroup = new aws.ec2.SecurityGroup(
    nameResource('alb-sg'),
    {
      vpcId: defaultVpcId,
      ingress: ingress,
      egress: egress,
    }
  );

  // Loadbalancer name can't exceed 32 characters
  const appLoadBalancer = new aws.lb.LoadBalancer(nameResource('alb', 32), {
    internal: false,
    loadBalancerType: 'application',
    enableHttp2: false, // HTTP2 implementation of AWS lb is buggy and the end-user traffic is handled by cloudfront
    subnets: defaultSubnetIds,
    securityGroups: [loadBalancerSecurityGroup.id],
    tags,
  });

  // Target group
  const targetGroup = new aws.lb.TargetGroup(nameResource('alb-tg', 32), {
    port: 3000, // Nextjs app port
    protocol: 'HTTP',
    targetType: 'ip',
    deregistrationDelay: 0,
    vpcId: defaultVpcId,
    healthCheck: {
      enabled: true,
      healthyThreshold: 5,
      interval: 30,
      matcher: '200',
      path: '/',
      port: 'traffic-port',
      protocol: 'HTTP',
      timeout: 5,
      unhealthyThreshold: 2,
    },
  });

  // Listener
  const listenerArgs = createListenerArgs(appLoadBalancer, domainSetup);
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

  const { domainName, url } = createAlbUris(appLoadBalancer, domainSetup);

  return {
    appLoadBalancer,
    targetGroup,
    loadBalancerSecurityGroup,
    listener,
    domainName,
    url,
  };
}

function createSecurityGroupRules(domainSetup?: DomainSetup) {
  // Inbound load balancer security rules
  const ingress = [
    {
      protocol: 'tcp',
      fromPort: 80,
      toPort: 80,
      cidrBlocks: ['0.0.0.0/0'],
      ipv6CidrBlocks: ['::/0'],
    },
  ];

  // If we have a domain (SSL)
  if (domainSetup?.loadBalancerDomainName) {
    ingress.push({
      protocol: 'tcp',
      fromPort: 443,
      toPort: 443,
      cidrBlocks: ['0.0.0.0/0'],
      ipv6CidrBlocks: ['::/0'],
    });
  }

  // Outbound rules
  const egress = [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
      ipv6CidrBlocks: ['::/0'],
    },
  ];

  return {
    ingress,
    egress,
  };
}

function createListenerArgs(
  appLoadBalancer: aws.lb.LoadBalancer,
  domainSetup?: DomainSetup
) {
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

  return listenerArgs;
}

function createAlbUris(
  appLoadBalancer: aws.lb.LoadBalancer,
  domainSetup?: DomainSetup
) {
  const domainName = domainSetup?.loadBalancerDomainName
    ? pulumi.interpolate`${domainSetup.loadBalancerDomainName}`
    : appLoadBalancer.dnsName;
  const url = domainSetup?.loadBalancerDomainName
    ? pulumi.interpolate`https://${domainSetup.loadBalancerDomainName}`
    : pulumi.interpolate`http://${appLoadBalancer.dnsName}`;

  return {
    domainName,
    url,
  };
}
