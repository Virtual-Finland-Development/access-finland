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

// Next.js Amplify App
const amplifyApp = new aws.amplify.App(`${projectName}-amplifyApp-${env}`, {
  tags,
  repository:
    'https://github.com/Virtual-Finland-Development/virtual-finland.git',
  accessToken: githubAccessToken,
  enableAutoBranchCreation: false,
  enableBranchAutoBuild: false,
  enableBranchAutoDeletion: false,
  environmentVariables: {
    NEXT_PUBLIC_AUTH_GW_BASE_URL: authGwEndpoint,
    NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
    NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
    BACKEND_SECRET_SIGN_KEY: backendSignKey,
  },
  buildSpec: `
    version: 1.0
    app:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build:mvp
            - npm run start:mvp
      artifacts:
        baseDirectory: apps/vf-mvp/.next
        files:
          - '**/*'
      cache:
        paths: []
  `,
});

new aws.amplify.Branch(`${projectName}-amplify-branch-${env}`, {
  tags,
  appId: amplifyApp.id,
  branchName: 'aws-amplify',
  framework: 'React',
  /* stage: 'PRODUCTION',
  environmentVariables: {
    REACT_APP_API_SERVER: 'https://api.example.com',
  }, */
});

// Export the App URL
export const appUrl = amplifyApp.defaultDomain;
