
import * as aws from '@pulumi/aws';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: {
    domainName,
  }
} = setup;

export function createDomainSetup() : { domainName?: string, certificate?: aws.acm.Certificate } {
  
  if (domainName) {
    const awsCertsRegion = new aws.Provider("aws-certificates-region", {region: "us-east-1"});
    
    const certificate = new aws.acm.Certificate(nameResource('domainCertificate'), {
      domainName: domainName,
      validationMethod: 'DNS',
      tags,
    }, { provider: awsCertsRegion});

    return {
      domainName,
      certificate: certificate,
    }
  }
  
  return {
    domainName,
    certificate: undefined,
  }
}