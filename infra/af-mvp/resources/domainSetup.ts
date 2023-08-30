import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: { domainConfig },
  currentStackReference,
} = setup;

function parseDomainNameFromURL(url: string) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

export function createDomainSetup() {
  if (domainConfig.enabled) {
    if (!domainConfig.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }

    const cdnURL = currentStackReference.getOutput('cdnURL');
    if (!cdnURL) {
      console.log(
        "Skipped creating domain configurations as there's a circular dependency to the CDN which is not yet created: you must run `pulumi up` again after the CDN is created."
      );
      return;
    }

    const cdnDomainName = cdnURL.apply(url => parseDomainNameFromURL(url));

    const zone = new aws.route53.Zone(
      nameResource('domainZone'),
      {
        name: domainConfig.domainRootName,
        tags,
      },
      { protect: true } // Keep the zone from being destroyed
    );

    const { certificate } = createDomainRecordAndCertificate(
      zone,
      domainConfig.domainName,
      cdnDomainName
    );

    return {
      domainName: domainConfig.domainName,
      loadBalancerDomainName: `loadbalancer.${domainConfig.domainName}`,
      certificate,
      zone,
    };
  }
  return;
}

export function createDomainRecordAndCertificate(
  zone: aws.route53.Zone,
  domainName: string,
  destinationDomainName: pulumi.Output<string>,
  certRegionProvider: aws.Provider = domainConfig.awsCertsRegionProvider
) {
  const domainNameResourceIdent = domainName.replace(/\./g, '-');

  const certificate = new aws.acm.Certificate(
    nameResource(`${domainNameResourceIdent}-domain-certificate`),
    {
      domainName: domainName,
      validationMethod: 'DNS',
      tags,
    },
    { provider: certRegionProvider }
  );

  // The main dns record
  const record = new aws.route53.Record(
    nameResource(`${domainNameResourceIdent}-cname-record`),
    {
      name: domainName,
      type: 'CNAME',
      ttl: 300,
      records: [destinationDomainName],
      zoneId: zone.id,
    }
  );

  return {
    certificate,
    record,
  };
}
