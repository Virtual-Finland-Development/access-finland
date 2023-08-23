import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';
import { createContainerImage } from './ecrContainerImage';

const { tags, envOverride } = setup;

export function createFargateService(
  loadBalancer: awsx.lb.ApplicationLoadBalancer,
  cluster: aws.ecs.Cluster,
  cdnSetup: {
    cdn: aws.cloudfront.Distribution;
    domainName: pulumi.Output<string>;
  },
  wafSetup?: {
    userPool: aws.cognito.UserPool;
    userPoolClient: aws.cognito.UserPoolClient;
    sharedCookieSecret: pulumi.Output<string>;
  }
) {
  // ECS Task role
  const awsIdentity = pulumi.output(aws.getCallerIdentity());
  const taskRole = new aws.iam.Role(nameResource('fargate-task-role'), {
    tags,
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'ecs-tasks.amazonaws.com',
    }),
  });

  const sinunaAccessPolicy = new aws.iam.Policy(
    nameResource('fargate-task-role-sinuna-policy'),
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

  // Attach a policy to grant access to Parameter Store
  new aws.iam.RolePolicyAttachment(
    nameResource('fargate-task-role-sinuna-policy-attachment'),
    {
      role: taskRole.name,
      policyArn: sinunaAccessPolicy.arn,
    }
  );

  // ECR Container image
  const image = createContainerImage(cdnSetup);

  // Fargate service
  return new awsx.ecs.FargateService(nameResource('fargate-service'), {
    tags,
    cluster: cluster.arn,
    assignPublicIp: true,
    continueBeforeSteadyState: false,
    taskDefinitionArgs: {
      containers: {
        service: {
          image: image.imageUri,
          portMappings: [
            {
              targetGroup: loadBalancer.defaultTargetGroup,
            },
          ],
          environment: [
            {
              name: 'WAF_USER_POOL_ID',
              value: wafSetup?.userPool.id || '',
            },
            {
              name: 'WAF_USER_POOL_CLIENT_ID',
              value: wafSetup?.userPoolClient.id || '',
            },
            {
              name: 'WAF_SHARED_COOKIE_SECRET',
              value: wafSetup?.sharedCookieSecret || '',
            },
          ],
        },
      },
      taskRole: {
        roleArn: taskRole.arn,
      },
    },
  });
}
