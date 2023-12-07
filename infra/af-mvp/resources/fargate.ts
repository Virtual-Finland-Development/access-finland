import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { ISetup, LoadBalancerSetup } from '../utils/types';
import { createContainerImage } from './ecrContainerImage';

export function createFargateService(
  setup: ISetup,
  loadBalancerSetup: LoadBalancerSetup,
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
  const taskRole = new aws.iam.Role(setup.nameResource('fargate-task-role'), {
    tags: setup.tags,
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'ecs-tasks.amazonaws.com',
    }),
  });

  const ssmPolicy = new aws.iam.Policy(
    setup.nameResource('fargate-task-role-ssm-policy'),
    {
      tags: setup.tags,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['ssm:GetParameter'],
            Resource: [
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${setup.envOverride}_SINUNA_CLIENT_ID`, // Access to stage-prefixed sinuna variables
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${setup.envOverride}_SINUNA_CLIENT_SECRET`,
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${setup.envOverride}_BACKEND_SECRET_PUBLIC_KEY`,
              pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${setup.envOverride}_BACKEND_SECRET_PRIVATE_KEY`,
            ],
          },
        ],
      },
    }
  );

  // Attach a policy to grant access to Parameter Store
  new aws.iam.RolePolicyAttachment(
    setup.nameResource('fargate-task-role-ssm-policy-attachment'),
    {
      role: taskRole.name,
      policyArn: ssmPolicy.arn,
    }
  );

  // ECR Container image
  const image = createContainerImage(setup, cdnSetup);

  // Configs
  const stackReference = new pulumi.StackReference(
    setup.infrastructureStackName
  );
  const sharedAccessKey = stackReference.requireOutput('SharedAccessKey');

  // Create log group (must be manually imported if already exists)
  const logGroup = new aws.cloudwatch.LogGroup(
    setup.nameResource('fargate-log-group'),
    {
      tags: setup.tags,
      name: setup.nameResource('log-group'),
      retentionInDays: 7,
    }
  );

  // Fargate service
  const service = new awsx.ecs.FargateService(
    setup.nameResource('fargate-service'),
    {
      tags: setup.tags,
      cluster: cluster.arn,
      assignPublicIp: true,
      continueBeforeSteadyState: false,
      taskDefinitionArgs: {
        containers: {
          service: {
            image: image.imageUri,
            portMappings: [
              {
                targetGroup: loadBalancerSetup.targetGroup,
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
              {
                name: 'USERS_API_ACCESS_KEY',
                value: sharedAccessKey,
              },
            ],
            logConfiguration: {
              logDriver: 'awslogs',
              options: {
                'awslogs-group': pulumi.interpolate`${logGroup.name}`,
                'awslogs-region': aws.config.region,
                'awslogs-stream-prefix': 'service',
              },
            },
            healthCheck: {
              command: [
                'CMD-SHELL',
                'wget --no-verbose --tries=1 --spider http://$(hostname):3000/api/health-check || exit 1',
              ],
              interval: 30,
              retries: 3,
              startPeriod: 10,
              timeout: 5,
            },
          },
        },
        taskRole: {
          roleArn: taskRole.arn,
        },
      },
    }
  );

  createErrorMonitor(setup, logGroup);

  return service;
}

function createErrorMonitor(setup: ISetup, logGroup: aws.cloudwatch.LogGroup) {
  const stackReference = new pulumi.StackReference(setup.monitoringStackName);
  const errorReportingFunctionArn = stackReference.requireOutput(
    'errorSubLambdaFunctionArn'
  );

  // Permissions for error reporting function to be invoked from the fargate logs
  new aws.lambda.Permission(
    setup.nameResource('error-alerter-invoke-permission'),
    {
      action: 'lambda:InvokeFunction',
      function: errorReportingFunctionArn,
      principal: 'logs.amazonaws.com',
      sourceArn: pulumi.interpolate`${logGroup.arn}:*`,
    }
  );

  // CloudWatch logs subscription filter
  new aws.cloudwatch.LogSubscriptionFilter(
    setup.nameResource('error-alerter-log-subscription-filter'),
    {
      logGroup: pulumi.interpolate`${logGroup.name}`,
      destinationArn: errorReportingFunctionArn,
      filterPattern: '?"ERROR" ?"Error" ?"error"',
    }
  );
}
