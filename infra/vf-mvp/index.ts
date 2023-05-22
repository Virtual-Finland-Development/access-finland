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

// ECR repository
const repository = new awsx.ecr.Repository(`${projectName}-ecr-repo-${env}`, {
  tags,
});

// ECR Docker image
const image = new awsx.ecr.Image(`${projectName}-mvp-image-${env}`, {
  repositoryUrl: repository.url,
  path: '../../', // path to a directory to use for the Docker build context (root of the repo)
  dockerfile: '../../apps/vf-mvp/Dockerfile', // dockerfile may be used to override the default Dockerfile name and/or location
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
});

// Fargate service
const service = new awsx.ecs.FargateService(
  `${projectName}-fargate-service-${env}`,
  {
    tags,
    cluster: cluster.arn,
    assignPublicIp: true,
    taskDefinitionArgs: {
      containers: {
        service: {
          image: image.imageUri,
          environment: [
            {
              name: 'NEXT_PUBLIC_AUTH_GW_BASE_URL',
              value: authGwEndpoint,
            },
            {
              name: 'NEXT_PUBLIC_TESTBED_API_BASE_URL',
              value: testbedApiEndpoint,
            },
            {
              name: 'NEXT_PUBLIC_CODESETS_BASE_URL',
              value: codesetsEndpoint,
            },
          ],
          portMappings: [
            {
              targetGroup: lb.defaultTargetGroup,
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
    // defaultRootObject: 'index.html',
    httpVersion: 'http2',
    isIpv6Enabled: true,
    priceClass: 'PriceClass_All',
    waitForDeployment: true,
    retainOnDelete: false,
    origins: [
      /* {
        originId: bucket.arn,
        domainName: bucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      }, */
      {
        originId: lb.loadBalancer.arn,
        domainName: lb.loadBalancer.dnsName,
        customOriginConfig: {
          originProtocolPolicy: 'https-only',
          originSslProtocols: ['TLSv1.2'],
          httpPort: 80,
          httpsPort: 80,
        },
        customHeaders: [
          {
            name: 'X-Custom-Header',
            value: 'random-value-1234567890',
          },
        ],
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: lb.loadBalancer.arn,
      viewerProtocolPolicy: 'allow-all',
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
    /* orderedCacheBehaviors: [
      {
        pathPattern: 'index.html',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        targetOriginId: bucket.arn,
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: 'all',
          },
        },
        defaultTtl: 10,
        minTtl: 0,
        maxTtl: 20,
        compress: true,
        viewerProtocolPolicy: 'redirect-to-https',
      },
    ], */
    /* customErrorResponses: [
      {
        errorCode: 404,
        responseCode: 404,
        responsePagePath: `/${errorDocument}`,
      },
      {
        errorCode: 403,
        responseCode: 403,
        responsePagePath: `/${errorDocument}`,
      },
    ], */
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
