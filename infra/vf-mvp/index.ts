import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

const org = pulumi.getOrganization();
const env = pulumi.getStack();
const projectName = pulumi.getProject();
const tags = {
  'vfd:project': projectName,
  'vfd:stack': env,
};

// external apis
const codesetsEndpoint = new pulumi.StackReference(
  `${org}/codesets/dev`
).getOutput('url');
const usersApiEndpoint = new pulumi.StackReference(
  `${org}/users-api/dev`
).getOutput('ApplicationUrl');

// Random value for custom header (for restricted CloudFront -> ALB access)
const customHeaderValue = pulumi.interpolate`${
  new random.RandomUuid(`${projectName}-uuid-${env}`).result
}`;

// Random value for secret sign key
const backendSignKey = pulumi.interpolate`${
  new random.RandomPassword(`${projectName}-backendSignKey-${env}`, {
    length: 32,
  }).result
}`;

// ECR repository
const repository = new awsx.ecr.Repository(`${projectName}-ecr-repo-${env}`, {
  tags,
  forceDelete: true,
});

// ECR Docker image
const image = new awsx.ecr.Image(`${projectName}-mvp-image-${env}`, {
  repositoryUrl: repository.url,
  path: '../../', // path to a directory to use for the Docker build context (root of the repo)
  dockerfile: '../../apps/vf-mvp/Dockerfile', // dockerfile may be used to override the default Dockerfile name and/or location
  extraOptions: ['--platform', 'linux/amd64'],
  args: {
    NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
    NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
    BACKEND_SECRET_SIGN_KEY: backendSignKey,
    NEXT_PUBLIC_STAGE: env,
  },
});

// ECS cluster
const cluster = new aws.ecs.Cluster(`${projectName}-ecs-cluster-${env}`, {
  tags,
});

// Application load balancer
const lb = new awsx.lb.ApplicationLoadBalancer(`${projectName}-alb-${env}`, {
  tags,
  defaultTargetGroup: {
    deregistrationDelay: 0,
    port: 3000,
  },
  listener: {
    port: 80,
    protocol: 'HTTP',
    tags,
    defaultActions: [
      {
        type: 'fixed-response',
        fixedResponse: {
          contentType: 'text/plain',
          messageBody: 'Access denied',
          statusCode: '403',
        },
      },
    ],
  },
});

const lbListenerRule = new aws.lb.ListenerRule(
  `${projectName}-alb-listener-rule-${env}`,
  {
    listenerArn: lb.listeners.apply(
      listeners =>
        pulumi.interpolate`${
          listeners?.find(l => l.port && l.port.apply(p => p === 80))?.arn || ''
        }`
    ),
    actions: [
      {
        type: 'forward',
        targetGroupArn: lb.defaultTargetGroup.arn,
      },
    ],
    conditions: [
      {
        httpHeader: {
          httpHeaderName: 'X-Custom-Header',
          values: [customHeaderValue],
        },
      },
    ],
  }
);

// ECS Task role
const awsIdentity = pulumi.output(aws.getCallerIdentity());
const taskRole = new aws.iam.Role(`${projectName}-fargate-task-role-${env}`, {
  tags,
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['ssm:GetParameter'],
        Resource: [
          pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${env}_SINUNA_CLIENT_ID`, // Access to stage-prefixed sinuna variables
          pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${env}_SINUNA_CLIENT_SECRET`,
        ],
      },
    ],
  },
});

// Fargate service
const fargateService = new awsx.ecs.FargateService(
  `${projectName}-fargate-service-${env}`,
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
              targetGroup: lb.defaultTargetGroup,
            },
          ],
        },
      },
      taskRole: {
        roleArn: taskRole.arn,
      },
    },
  }
);

// CloudFront
const cdn = new aws.cloudfront.Distribution(
  `${projectName}-cdn-${env}`,
  {
    enabled: true,
    httpVersion: 'http2',
    isIpv6Enabled: true,
    priceClass: 'PriceClass_All',
    waitForDeployment: true,
    retainOnDelete: false,
    origins: [
      {
        originId: lb.loadBalancer.arn,
        domainName: lb.loadBalancer.dnsName,
        customOriginConfig: {
          originProtocolPolicy: 'http-only',
          originSslProtocols: ['TLSv1.2'],
          httpPort: 80,
          httpsPort: 443,
        },
        customHeaders: [
          {
            name: 'X-Custom-Header',
            value: customHeaderValue,
          },
        ],
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: lb.loadBalancer.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: [
        'HEAD',
        'DELETE',
        'POST',
        'GET',
        'OPTIONS',
        'PUT',
        'PATCH',
      ],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      defaultTtl: 600,
      maxTtl: 600,
      minTtl: 600,
      forwardedValues: {
        queryString: true,
        cookies: {
          forward: 'all',
        },
      },
    },
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    tags,
  },
  {
    protect: false,
  }
);

// Export the URL of load balancer.
export const url = lb.loadBalancer.dnsName;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;
