import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

export type DomainSetup =
  | {
      domainName: string;
      loadBalancerDomainName: string;
      certificate: aws.acm.Certificate;
      zone: aws.route53.Zone;
    }
  | undefined;

export type LoadBalancerSetup = {
  appLoadBalancer: awsx.lb.ApplicationLoadBalancer,
  domainName: pulumi.Output<string>,
  url: pulumi.Output<string>,
}
