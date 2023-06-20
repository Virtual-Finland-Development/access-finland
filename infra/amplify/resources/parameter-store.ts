import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const { tags, amplifyBranchOverride } = setup;

export function configureParameterStore(
  amplifyAppId: pulumi.Output<string>,
  amplifyExecUserAccessKey: aws.iam.AccessKey
) {
  // AWS Parameter Store for Amplify Build step to access key and secret
  new aws.ssm.Parameter(nameResource('amplifyUserAccessKeyParameter'), {
    tags,
    name: pulumi.interpolate`/amplify/${amplifyAppId}/${amplifyBranchOverride}/AWS_ACCESS_KEY_ID`,
    type: 'SecureString',
    value: amplifyExecUserAccessKey.id,
  });

  // And secret
  new aws.ssm.Parameter(nameResource('amplifyUserAccessSecretParameter'), {
    tags,
    name: pulumi.interpolate`/amplify/${amplifyAppId}/${amplifyBranchOverride}/AWS_SECRET_ACCESS_KEY`,
    type: 'SecureString',
    value: amplifyExecUserAccessKey.secret,
  });
}
