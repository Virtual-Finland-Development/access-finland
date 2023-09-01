import * as aws from '@pulumi/aws';
import { nameResource } from '../utils/setup';

async function getDefaultVpc() {
  const defaultVpc = await aws.ec2.getVpc({ default: true });
  return defaultVpc.id || '';
}

async function getDefaultSubnets(vpcId: string) {
  const defaultSubnets = await aws.ec2.getSubnetIds({ vpcId: vpcId });
  return defaultSubnets.ids || [];
}

export const defaultVpcId = getDefaultVpc();
export const defaultSubnetIds = defaultVpcId.then(getDefaultSubnets);

export const defaultSecurityGroup = new aws.ec2.SecurityGroup(
  nameResource('default-sg'),
  {
    vpcId: defaultVpcId,
    ingress: [
      {
        protocol: 'tcp',
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ['0.0.0.0/0'],
        ipv6CidrBlocks: ['::/0'],
      },
    ],
  }
);
