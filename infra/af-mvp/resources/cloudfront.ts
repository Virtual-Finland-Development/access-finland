import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

import { DistributionArgs } from '@pulumi/aws/cloudfront';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  customHeaderValue,
} = setup;

export function createContentDeliveryNetwork(lb: awsx.lb.ApplicationLoadBalancer, domainSetup?: { domainName?: string, certificate?: aws.acm.Certificate }) {

  // CloudFront domain name
  const domainNames = domainSetup?.domainName ? [domainSetup.domainName] : undefined;

  // CloudFront viewer certificate
  const viewerCertificate: DistributionArgs["viewerCertificate"] = {
    cloudfrontDefaultCertificate: true,
  };
  if (domainSetup?.certificate) {
    viewerCertificate.acmCertificateArn = domainSetup.certificate.arn;
    viewerCertificate.sslSupportMethod = 'sni-only';
  }
  
  // CloudFront
  return new aws.cloudfront.Distribution(
    nameResource('cdn'),
    {
      enabled: true,
      httpVersion: 'http2',
      isIpv6Enabled: true,
      priceClass: 'PriceClass_All',
      waitForDeployment: true,
      retainOnDelete: false,
      aliases: domainNames,
      origins: [
        {
          originId: lb.loadBalancer.arn,
          domainName: lb.loadBalancer.dnsName,
          customOriginConfig: {
            originProtocolPolicy: 'http-only',
            originSslProtocols: ['TLSv1.2'],
            httpPort: 80,
            httpsPort: 443,
          },
          customHeaders: [
            {
              name: 'X-Custom-Header',
              value: customHeaderValue,
            },
          ],
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: lb.loadBalancer.arn,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: [
          'HEAD',
          'DELETE',
          'POST',
          'GET',
          'OPTIONS',
          'PUT',
          'PATCH',
        ],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        defaultTtl: 600,
        maxTtl: 600,
        minTtl: 600,
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: 'all',
          },
        },
      },
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      viewerCertificate: viewerCertificate,
      tags,
    },
    {
      protect: false,
    }
  );
}