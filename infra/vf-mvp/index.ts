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

// Export the URL of load balancer.
export const url = lb.loadBalancer.dnsName;
