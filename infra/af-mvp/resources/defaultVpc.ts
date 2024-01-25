import * as aws from '@pulumi/aws';

async function getDefaultVpc() {
  const defaultVpc = await aws.ec2.getVpc({ default: true });
  return defaultVpc.id || '';
}

async function getDefaultSubnets(vpcId: string) {
  const defaultSubnets = await aws.ec2.getSubnets({
    filters: [
      {
        name: 'vpc-id',
        values: [vpcId],
      },
    ],
  });
  return defaultSubnets.ids || [];
}

export const defaultVpcId = getDefaultVpc();
export const defaultSubnetIds = defaultVpcId.then(getDefaultSubnets);
