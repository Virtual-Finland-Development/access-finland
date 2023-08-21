
import * as aws from '@pulumi/aws';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: {
    domainSetup,
  }
} = setup;

export function createDomainSetup() : { domainName?: string, certificate?: aws.acm.Certificate } {

  if (domainSetup.enabled) {
    if (!domainSetup.domainName) {
      throw new Error('Domain name is required when CDN is enabled');
    }
    
    const awsCertsRegion = new aws.Provider(nameResource("cert-region"), {region: "us-east-1"});
    
    const certificate = new aws.acm.Certificate(nameResource('domainCertificate'), {
      domainName: domainSetup.domainName,
      validationMethod: 'DNS',
      tags,
    }, { provider: awsCertsRegion});

    return {
      domainName: domainSetup.domainName,
      certificate: certificate,
    }
  }
  
  return {
    domainName: undefined,
    certificate: undefined,
  }
}