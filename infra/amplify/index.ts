import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

const org = pulumi.getOrganization();
const env = pulumi.getStack();
const projectName = pulumi.getProject();
const tags = {
  'vfd:project': projectName,
  'vfd:stack': env,
};
const config = new pulumi.Config();
const githubAccessToken = config.get('githubAccessToken') || '';

// external apis
const authGwEndpoint = new pulumi.StackReference(
  `${org}/authentication-gw/dev`
).getOutput('endpoint');
const codesetsEndpoint = new pulumi.StackReference(
  `${org}/codesets/dev`
).getOutput('url');
const usersApiEndpoint = new pulumi.StackReference(
  `${org}/users-api/dev`
).getOutput('ApplicationUrl');

// Random value for secret sign key
const backendSignKey = pulumi.interpolate`${
  new random.RandomPassword(`${projectName}-backendSignKey-${env}`, {
    length: 32,
  }).result
}`;

// Fetch the AWS pre-configured service role for Amplify
const amplifyServiceRole = pulumi.output(
  aws.iam.getRole({ name: 'amplifyconsole-backend-role' })
);

// Next.js Amplify App
const amplifyApp = new aws.amplify.App(`${projectName}-amplifyApp-${env}`, {
  tags,
  repository: 'https://github.com/Virtual-Finland-Development/virtual-finland',
  accessToken: githubAccessToken,
  iamServiceRoleArn: amplifyServiceRole.arn,
  enableAutoBranchCreation: false,
  enableBranchAutoBuild: true,
  enableBranchAutoDeletion: false,
  environmentVariables: {
    NEXT_PUBLIC_AUTH_GW_BASE_URL: authGwEndpoint,
    NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
    NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
    BACKEND_SECRET_SIGN_KEY: backendSignKey,
  },
  platform: 'WEB_COMPUTE',
  buildSpec: `
    version: 1.0
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npx npm install
            build:
              commands:
                - npx turbo run build --filter=vf-mvp
          artifacts:
            baseDirectory: apps/vf-mvp/.next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
          buildPath: /
        appRoot: apps/vf-mvp
  `,
});

new aws.amplify.Branch(`${projectName}-amplify-branch-${env}`, {
  tags,
  appId: amplifyApp.id,
  branchName: 'aws-amplify',
  enableAutoBuild: true,
  description: 'Tracks the aws-amplify branch in Github.',
});

// Export the App URL
export const appUrl = amplifyApp.defaultDomain;
