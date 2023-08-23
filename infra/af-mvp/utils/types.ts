import * as aws from '@pulumi/aws';

export type DomainSetup =
  | {
      domainName: string;
      loadBalancerDomainName: string;
      certificate: aws.acm.Certificate;
      zone: aws.route53.Zone;
    }
  | undefined;
