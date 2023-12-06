import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { ISetup } from '../utils/types';

function parseDomainNameFromURL(url: string) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

export async function createDomainSetup(setup: ISetup) {
  if (setup.cdn.domainConfig.enabled) {
    if (!setup.cdn.domainConfig.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }

    const zone = new aws.route53.Zone(
      setup.nameResource('domainZone'),
      {
        name: setup.cdn.domainConfig.domainRootName,
        tags: setup.tags,
      },
      { protect: true } // Keep the zone from being destroyed
    );

    const cdnURL = await setup.currentStackReference.getOutputValue('cdnURL');
    if (!cdnURL) {
      console.log(
        "For now, skipped creating domain configurations as there's a circular dependency to the CDN which is not yet created."
      );
      return;
    }

    const cdnDomainName = parseDomainNameFromURL(cdnURL);

    const { certificate } = createDomainRecordAndCertificate(
      setup,
      zone,
      setup.cdn.domainConfig.domainName,
      pulumi.output(cdnDomainName)
    );

    return {
      domainName: setup.cdn.domainConfig.domainName,
      loadBalancerDomainName: `loadbalancer.${setup.cdn.domainConfig.domainName}`,
      certificate,
      zone,
    };
  }
  return;
}

export function createDomainRecordAndCertificate(
  setup: ISetup,
  zone: aws.route53.Zone,
  domainName: string,
  destinationDomainName: pulumi.Output<string>,
  certRegionProvider: aws.Provider = setup.cdn.domainConfig
    .awsCertsRegionProvider
) {
  const domainNameResourceIdent = domainName.replace(/\./g, '-');

  const certificate = new aws.acm.Certificate(
    setup.nameResource(`${domainNameResourceIdent}-domain-certificate`),
    {
      domainName: domainName,
      validationMethod: 'DNS',
      tags: setup.tags,
    },
    { provider: certRegionProvider }
  );

  // The main dns record
  const record = new aws.route53.Record(
    setup.nameResource(`${domainNameResourceIdent}-cname-record`),
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
