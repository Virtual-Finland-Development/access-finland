import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

const org = pulumi.getOrganization();
const env = pulumi.getStack();
const projectName = pulumi.getProject();
const tags = {
  'vfd:project': projectName,
  'vfd:stack': env,
};

// external apis
const authGwEndpoint = new pulumi.StackReference(
  `${org}/authentication-gw/dev`
).getOutput('endpoint');
const testbedApiEndpoint = new pulumi.StackReference(
  `${org}/testbed-api/dev`
).getOutput('url');
const codesetsEndpoint = new pulumi.StackReference(
  `${org}/codesets/dev`
).getOutput('url');

// Random value for custom header (for restricted CloudFront -> ALB access)
const customHeaderValue = `vf-${Date.now()}`;

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
  args: {
    NEXT_PUBLIC_AUTH_GW_BASE_URL: authGwEndpoint,
    NEXT_PUBLIC_TESTBED_API_BASE_URL: testbedApiEndpoint,
    NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
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

/* const defaultVpc = new awsx.ec2.DefaultVpc('default-vpc');

const lb = new aws.lb.LoadBalancer(`${projectName}-alb-${env}`, {
  loadBalancerType: 'application',
  subnets: defaultVpc.publicSubnetIds.apply(ids => ids),
  tags,
});

const lbTargetGroup = new aws.lb.TargetGroup(`vf-alb-tg-${env}`, {
  port: 3000,
  protocol: 'HTTP',
  vpcId: defaultVpc.vpcId,
  targetType: 'ip',
});

const lbListener = new aws.lb.Listener(`${projectName}-alb-listener-${env}`, {
  loadBalancerArn: lb.arn,
  port: 80,
  protocol: 'HTTP',
  // sslPolicy: '', (needed if https)
  // certificateArn: '', (needed if https)
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
}); */

const lbListenerRule = new aws.lb.ListenerRule(
  `${projectName}-alb-listener-rule-${env}`,
  {
    listenerArn: lb.listeners.apply(
      listeners =>
        pulumi.interpolate`${
          listeners?.find(l => l.port && l.port.apply(p => p === 80))?.arn || ''
        }`
    ),
    // listenerArn: lbListener.arn,
    // priority: 100,
    actions: [
      {
        type: 'forward',
        // targetGroupArn: lbTargetGroup.arn,
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
              // targetGroup: lbTargetGroup,
            },
          ],
        },
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
        /* originId: lb.arn,
        domainName: lb.dnsName, */
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
      // targetOriginId: lb.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
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
// export const url = lb.dnsName;
// Export the CloudFront url.
export const cdnURL = pulumi.interpolate`https://${cdn.domainName}`;

export const listenerArn = lb.listeners.apply(
  listeners =>
    pulumi.interpolate`${
      listeners?.find(l => l.port && l.port.apply(p => p === 80))?.arn || ''
    }`
);

// export const vpcPublicSubnetIds = defaultVpc.publicSubnetIds.apply(ids => ids);
