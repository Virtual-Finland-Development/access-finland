import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

const org = pulumi.getOrganization();
const env = pulumi.getStack();
const projectName = pulumi.getProject();

// external apis
const authGwEndpoint = new pulumi.StackReference(
  `${org}/authentication-gw/${env}`
).getOutput('endpoint');
const testbedApiEndpoint = new pulumi.StackReference(
  `${org}/testbed-api/${env}`
).getOutput('url');
const codesetsEndpoint = new pulumi.StackReference(
  `${org}/codesets/${env}`
).getOutput('url');

// ECR repository
const repository = new awsx.ecr.Repository(`${projectName}-ecr-repo-${env}`);

// ECR Docker image
const image = new awsx.ecr.Image(`${projectName}-mvp-image-${env}`, {
  repositoryUrl: repository.url,
  path: '../../', // path to a directory to use for the Docker build context (root of the repo)
  dockerfile: '../../apps/vf-mvp/DockerFile', // dockerfile may be used to override the default Dockerfile name and/or location
});

// Application load balancer
const lb = new awsx.lb.ApplicationLoadBalancer(`${projectName}-alb-${env}`, {});

// Fargate service
const service = new awsx.ecs.FargateService(
  `${projectName}-fargate-service-${env}`,
  {
    assignPublicIp: true,
    taskDefinitionArgs: {
      containers: {
        service: {
          image: image.urn,
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