import * as aws from '@pulumi/aws';
import { local } from '@pulumi/command';
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
  enableBranchAutoBuild: false,
  enableBranchAutoDeletion: false,
  environmentVariables: {
    AMPLIFY_MONOREPO_APP_ROOT: 'apps/vf-mvp',
    AMPLIFY_DIFF_DEPLOY: 'false',
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

// Amplify branch, maps to track repo branch named 'aws-amplify'.
const trackedBranch = new aws.amplify.Branch(
  `${projectName}-amplify-branch-${env}`,
  {
    tags,
    appId: amplifyApp.id,
    branchName: 'aws-amplify',
    enableAutoBuild: false,
    description: 'Tracks the aws-amplify branch in Github.',
  }
);

// Manually run build/deployment for specified branch
new local.Command(
  'deployment',
  {
    create: pulumi.interpolate`aws amplify start-job --app-id ${amplifyApp.id} --branch-name ${trackedBranch.branchName} --job-type RELEASE --job-reason test`,
    triggers: [new Date().getTime().toString()],
  },
  { deleteBeforeReplace: true }
);

// Export the App URL (maps to created branch)
export const appUrl = pulumi.interpolate`${trackedBranch.branchName}.${amplifyApp.defaultDomain}`;
