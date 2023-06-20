import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const { tags, envOverride } = setup;

export function configureIamUser() {
  // AWS IAM User for accessing parameters from SSM Parameter Store
  const amplifyExecUser = new aws.iam.User(nameResource('amplifyExecUser'), {
    tags,
  });

  // Access key and secret for the Amplify User
  const amplifyExecUserAccessKey = new aws.iam.AccessKey(
    nameResource('amplifyExecUserAccessKey'),
    {
      user: amplifyExecUser.name,
    }
  );

  // Current aws account id
  const awsIdentity = pulumi.output(aws.getCallerIdentity());

  // AWS IAM Policy for Amplify User to access parameters from SSM Parameter Store
  const amplifyExecUserSinunaAccessPolicy = new aws.iam.Policy(
    nameResource('amplifyExecUserSinunaAccessPolicy'),
    {
      tags,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['ssm:GetParameter'],
            Resource: [
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${envOverride}_SINUNA_CLIENT_ID`, // Access to stage-prefixed sinuna variables
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${envOverride}_SINUNA_CLIENT_SECRET`,
            ],
          },
        ],
      },
    }
  );

  // Attach policy to user
  new aws.iam.UserPolicyAttachment(
    nameResource('amplifyExecUserSinunaAccessPolicyAttachment'),
    {
      user: amplifyExecUser.name,
      policyArn: amplifyExecUserSinunaAccessPolicy.arn,
    }
  );

  return {
    amplifyExecUserAccessKey,
  };
}
