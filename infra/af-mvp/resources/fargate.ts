import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  envOverride,
  externalApis: { codesetsEndpoint, usersApiEndpoint },
  backendSignKey
} = setup;

export function createFargateService(loadBalancer: awsx.lb.ApplicationLoadBalancer, cluster: aws.ecs.Cluster, cdn: aws.cloudfront.Distribution, wafSetup?: { userPool: aws.cognito.UserPool, userPoolClient: aws.cognito.UserPoolClient, cognitoDomain: aws.cognito.UserPoolDomain, sharedCookieSecret: pulumi.Output<string> }) {

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
  new aws.iam.RolePolicyAttachment(nameResource('fargate-task-role-sinuna-policy-attachment'), {
    role: taskRole.name,
    policyArn: sinunaAccessPolicy.arn,
  });

  const testbedConfig = new pulumi.Config("testbed");

  // ECR repository
  const repository = new awsx.ecr.Repository(nameResource('ecr-repo'), {
    tags,
    forceDelete: true,
  });

  // ECR Docker image
  const image = new awsx.ecr.Image(nameResource('mvp-image'), {
    repositoryUrl: repository.url,
    path: '../../', // path to a directory to use for the Docker build context (root of the repo)
    dockerfile: '../../apps/af-mvp/Dockerfile', // dockerfile may be used to override the default Dockerfile name and/or location
    extraOptions: ['--platform', 'linux/amd64'],
    args: {
      NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
      NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
      BACKEND_SECRET_SIGN_KEY: backendSignKey,
      NEXT_PUBLIC_STAGE: envOverride,
      TESTBED_PRODUCT_GATEWAY_BASE_URL: process.env.TESTBED_PRODUCT_GATEWAY_BASE_URL || testbedConfig.require("gatewayUrl"),
      TESTBED_DEFAULT_DATA_SOURCE: process.env.TESTBED_DEFAULT_DATA_SOURCE || testbedConfig.require("defaultDataSource"),
      FRONTEND_ORIGIN_URI: pulumi.interpolate`https://${cdn.domainName}`,
    },
  });

  // Fargate service
  return new awsx.ecs.FargateService(
    nameResource('fargate-service'),
    {
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
                value: pulumi.interpolate`${wafSetup?.sharedCookieSecret || ''}`,
              }
            ],
          },
        },
        taskRole: {
          roleArn: taskRole.arn,
        },
      },
    }
  );
}