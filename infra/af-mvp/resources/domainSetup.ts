
import * as aws from '@pulumi/aws';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: {
    domainSetup,
  },
  currentStackReference
} = setup;

function parseDomainNameFromURL(url: string) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}


export function createDomainSetup() {

  if (domainSetup.enabled) {
    if (!domainSetup.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }

    const cdnURL = currentStackReference.getOutput('cdnURL');
    if (!cdnURL) {
      console.log("Skipped creating domain configurations as there's a circular dependency to the CDN which is not yet created: you must run `pulumi up` again after the CDN is created.");
      return;
    }

    const cdnDomainName = cdnURL.apply(url => parseDomainNameFromURL(url));
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

    // The main dns record
    new aws.route53.Record(nameResource('domainRecord'), {
      name: domainSetup.domainName,
      type: 'CNAME',
      ttl: 300,
      records: [cdnDomainName],
      zoneId: zone.arn,
    });

    // Cert validation record
    const certValidation = new aws.route53.Record(nameResource('certValidation'), {
        name: certificate.domainValidationOptions[0].resourceRecordName,
        records: [certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: 60,
        type: certificate.domainValidationOptions[0].resourceRecordType,
        zoneId: zone.zoneId,
    });

    new aws.acm.CertificateValidation(nameResource('cert'), {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certValidation.fqdn],
    });

    return { domainName: domainSetup.domainName, certificate: certificate };
  }
  return { domainName: undefined, certificate: undefined }
}