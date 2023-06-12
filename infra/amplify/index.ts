/* eslint-disable turbo/no-undeclared-env-vars */
import { AmplifyClient, GetJobCommand } from '@aws-sdk/client-amplify';
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
const githubAccessToken =
  config.get('githubAccessToken') || process.env.GITHUB_ACCESS_TOKEN || '';

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
// Caveat: deployment will fail, if existing operation is running with error:
// An error occurred (LimitExceededException) when calling the StartJob operation (reached max retries: 2): The requested branch <branch> already have pending or running jobs)
const startJobCommand = new local.Command(
  'deployment',
  {
    create: pulumi.interpolate`aws amplify start-job --app-id ${amplifyApp.id} --branch-name ${trackedBranch.branchName} --job-type RELEASE --job-reason test --output json`,
    triggers: [new Date().getTime().toString()],
  },
  { deleteBeforeReplace: true }
);

//
// Wait for deployment to finish, fail or timeout
//
pulumi
  .all([startJobCommand.stdout, amplifyApp.id, trackedBranch.branchName])
  .apply(async ([stdout, appId, branchName]) => {
    if (pulumi.runtime.isDryRun()) {
      return;
    }
    const jobId = JSON.parse(stdout).jobSummary.jobId;
    const amplifyClient = new AmplifyClient({});

    try {
      const jobStatus = await new Promise((resolve, reject) => {
        const timeoutIntervalMs = 5000; // 5 second interval
        let timeoutCountdownSecs = 300; // 5 minutes timeout

        const interval = setInterval(async () => {
          timeoutCountdownSecs =
            timeoutCountdownSecs - timeoutIntervalMs / 1000; // Lower the timeout countdown by the interval

          const { job } = await amplifyClient.send(
            new GetJobCommand({
              appId,
              branchName,
              jobId,
            })
          );

          const jobStatus = job?.summary?.status;
          if (jobStatus === 'SUCCEED') {
            clearInterval(interval);
            resolve(jobStatus);
          } else {
            if (jobStatus === 'FAILED') {
              clearInterval(interval);
              reject(jobStatus);
            } else if (timeoutCountdownSecs <= 0) {
              clearInterval(interval);
              reject('TIMEOUT');
            }
          }
        }, timeoutIntervalMs);
      });

      console.log(`Deployment finished with status: ${jobStatus}`);
    } catch (jobStatus) {
      if (typeof jobStatus === 'string') {
        console.error(`Deployment failed with status: ${jobStatus}`);
      }
      throw jobStatus; // Ensure pulumi fails
    }
  });

// Export the App URL (maps to created branch)
export const appUrl = pulumi.interpolate`${trackedBranch.branchName}.${amplifyApp.defaultDomain}`;
