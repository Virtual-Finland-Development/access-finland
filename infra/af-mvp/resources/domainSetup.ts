
import * as aws from '@pulumi/aws';
import { DistributionArgs } from '@pulumi/aws/cloudfront';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: {
    domainSetup,
  }
} = setup;


export function createDomainSetup(cdn: aws.cloudfront.Distribution) {

  if (domainSetup.enabled) {
    if (!domainSetup.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }
  
    const awsCertsRegion = new aws.Provider(nameResource("cert-region"), { region: "us-east-1" });
    
    const zone = new aws.route53.Zone(nameResource('domainZone'), {
      name: domainSetup.domainRootName,
      tags,
    }, { protect: true });

    const certificate = new aws.acm.Certificate(nameResource('domainCertificate'), {
      domainName: domainSetup.domainName,
      validationMethod: 'DNS',
      tags,
    }, { provider: awsCertsRegion, protect: false });

    configureCloudFront({ domainName: domainSetup.domainName, certificate, zone }, cdn);
  }
}

function configureCloudFront(domainSetup: { domainName: string, certificate: aws.acm.Certificate, zone: aws.route53.Zone }, cdn: aws.cloudfront.Distribution) {

  // CloudFront viewer certificate
  const viewerCertificate: DistributionArgs["viewerCertificate"] = {
    cloudfrontDefaultCertificate: true,
    acmCertificateArn: domainSetup.certificate.arn,
    sslSupportMethod: 'sni-only',
  };
  const domainAliases = [domainSetup.domainName];

  // Update cloudfront distribution
  aws.cloudfront.Distribution.get(nameResource('cdn-udpate'), cdn.id, {
    viewerCertificate: viewerCertificate,
    aliases: domainAliases,
  });

  // The main dns record
  new aws.route53.Record(nameResource('domainRecord'), {
    name: domainSetup.domainName,
    type: 'CNAME',
    ttl: 300,
    records: [cdn.domainName],
    zoneId: domainSetup.zone.arn,
  });

  // Cert validation record
  const certValidation = new aws.route53.Record(nameResource('certValidation'), {
      name: domainSetup.certificate.domainValidationOptions[0].resourceRecordName,
      records: [domainSetup.certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 60,
      type: domainSetup.certificate.domainValidationOptions[0].resourceRecordType,
      zoneId: domainSetup.zone.zoneId,
  });

  new aws.acm.CertificateValidation(nameResource('cert'), {
      certificateArn: domainSetup.certificate.arn,
      validationRecordFqdns: [certValidation.fqdn],
  });
}