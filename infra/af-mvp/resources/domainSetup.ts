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

export async function createDomainSetup() {
  if (domainConfig.enabled) {
    if (!domainConfig.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }

    const zone = new aws.route53.Zone(
      nameResource('domainZone'),
      {
        name: domainConfig.domainRootName,
        tags,
      },
      { protect: true } // Keep the zone from being destroyed
    );

    const cdnURL = await currentStackReference.getOutputValue('cdnURL');
    if (!cdnURL) {
      console.log(
        "Skipped creating domain configurations as there's a circular dependency to the CDN which is not yet created."
      );
      return;
    }

    const cdnDomainName = parseDomainNameFromURL(cdnURL);
    let domainCertificate: aws.acm.Certificate;

    // If the domain is the root domain, we need to create an ALIAS record instead of a CNAME
    // The reasoning is that the root domain cannot be a CNAME as it conflicts with the apex records, e.g. NS, SOA, MX, etc.
    // With AWS we use an ALIAS record instead, which is a special type of record that points to another AWS resource like cloudfront
    // The root domain is the domain without a subdomain, e.g. example.com, not www.example.com
    if (domainConfig.domainName === domainConfig.domainRootName) {
      new aws.route53.Record(nameResource('domainAliasRecord'), {
        name: domainConfig.domainName,
        type: 'A',
        zoneId: zone.id,
        aliases: [
          {
            name: cdnDomainName,
            zoneId: 'Z2FDTNDATAQYW2', // CloudFront zone ID: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordsetgroup-aliastarget.html
            evaluateTargetHealth: true,
          },
        ],
      });

      domainCertificate = createDomainCertificateAndVerifyRecord(
        zone,
        domainConfig.domainName
      );
    } else {
      const { certificate } = createDomainRecordAndCertificate(
        zone,
        domainConfig.domainName,
        pulumi.output(cdnDomainName)
      );
      domainCertificate = certificate;
    }

    return {
      domainName: domainConfig.domainName,
      certificate: domainCertificate,
      loadBalancerDomainName: domainConfig.loadBalancerDomainName,
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

  const certificate = createDomainCertificateAndVerifyRecord(
    zone,
    domainName,
    certRegionProvider
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

export function createDomainCertificateAndVerifyRecord(
  zone: aws.route53.Zone,
  domainName: string,
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

  // Create verification record
  new aws.route53.Record(
    nameResource(`${domainNameResourceIdent}-certificate-validation-record`),
    {
      name: certificate.domainValidationOptions[0].resourceRecordName,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      zoneId: zone.id,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 300,
    }
  );

  return certificate;
}
