import * as aws from '@pulumi/aws';
import { DistributionArgs } from '@pulumi/aws/cloudfront';
import * as pulumi from '@pulumi/pulumi';
import { DomainSetup, ISetup, LoadBalancerSetup } from '../utils/types';

export function createContentDeliveryNetwork(
  setup: ISetup,
  loadBalancerSetup: LoadBalancerSetup,
  domainSetup: DomainSetup,
  webApplicationFirewall?: aws.wafv2.WebAcl
) {
  // CloudFront domain name
  const domainNames = domainSetup?.domainName
    ? [domainSetup.domainName]
    : undefined;

  // CloudFront viewer certificate setup
  const viewerCertificate: DistributionArgs['viewerCertificate'] = {
    cloudfrontDefaultCertificate: true,
  };
  let originProtocolPolicy = 'http-only';
  if (domainSetup?.certificate) {
    viewerCertificate.acmCertificateArn = domainSetup.certificate.arn;
    viewerCertificate.sslSupportMethod = 'sni-only';
    originProtocolPolicy = 'https-only';
  }

  // Load-balancer domain name
  const loadBalancerDomainName = loadBalancerSetup.domainName;

  // Firewall config
  const webAclId = webApplicationFirewall
    ? webApplicationFirewall.arn
    : undefined;

  // CloudFront
  const cdn = new aws.cloudfront.Distribution(
    setup.nameResource('cdn'),
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
          originId: loadBalancerSetup.appLoadBalancer.arn,
          domainName: loadBalancerDomainName,
          customOriginConfig: {
            originProtocolPolicy: originProtocolPolicy,
            originSslProtocols: ['TLSv1.2'],
            httpPort: 80,
            httpsPort: 443,
          },
          customHeaders: [
            {
              name: 'X-Custom-Header',
              value: setup.customHeaderValue,
            },
          ],
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: loadBalancerSetup.appLoadBalancer.arn,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
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
      orderedCacheBehaviors: [
        {
          pathPattern: '/api/*',
          targetOriginId: loadBalancerSetup.appLoadBalancer.arn,
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
          defaultTtl: 0,
          maxTtl: 0,
          minTtl: 0,
          forwardedValues: {
            queryString: true,
            cookies: {
              forward: 'all',
            },
          },
        },
      ],
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      viewerCertificate: viewerCertificate,
      webAclId: webAclId,
      tags: setup.tags,
    },
    {
      protect: false,
    }
  );

  return {
    cdn,
    domainName: pulumi.interpolate`${
      domainSetup?.domainName ? domainSetup.domainName : cdn.domainName
    }`,
  };
}
