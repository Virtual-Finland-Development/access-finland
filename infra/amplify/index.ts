/* eslint-disable turbo/no-undeclared-env-vars */
import {
  AmplifyClient,
  GetJobCommand,
  StartJobCommand,
} from '@aws-sdk/client-amplify';
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
const githubAccessToken =
  config.get('githubAccessToken') || process.env.GITHUB_ACCESS_TOKEN || '';

// @temporary overrides for testing --->
const envOverride = 'dev';
const amplifyBranchOverride = 'aws-amplify';
// <---

// external apis
const codesetsEndpoint = new pulumi.StackReference(
  `${org}/codesets/${envOverride}`
).getOutput('url');
const usersApiEndpoint = new pulumi.StackReference(
  `${org}/users-api/${envOverride}`
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

// AWS IAM User for accessing parameters from SSM Parameter Store
const amplifyExecUser = new aws.iam.User(
  `${projectName}-amplifyExecUser-${env}`,
  {
    tags,
  }
);
// Access key and secret for the Amplify User
const amplifyExecUserAccessKey = new aws.iam.AccessKey(
  `${projectName}-amplifyExecUserAccessKey-${env}`,
  {
    user: amplifyExecUser.name,
  }
);

// Current aws account id
const awsIdentity = pulumi.output(aws.getCallerIdentity());

// AWS IAM Policy for Amplify User to access parameters from SSM Parameter Store
const amplifyExecUserSinunaAccessPolicy = new aws.iam.Policy(
  `${projectName}-amplifyExecUserSinunaAccessPolicy-${env}`,
  {
    tags,
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['ssm:GetParameter'],
          Resource: [
            pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${envOverride}_SINUNA_CLIENT_ID`, // Access to stage-prefixed sinuna variables
            pulumi.interpolate`arn:aws:ssm:${aws.config.region}:${awsIdentity.accountId}:parameter/${envOverride}_SINUNA_CLIENT_SECRET`,
          ],
        },
      ],
    },
  }
);

// Attach policy to user
new aws.iam.UserPolicyAttachment(
  `${projectName}-amplifyExecUserSinunaAccessPolicyAttachment-${env}`,
  {
    user: amplifyExecUser.name,
    policyArn: amplifyExecUserSinunaAccessPolicy.arn,
  }
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
    NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
    NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
    BACKEND_SECRET_SIGN_KEY: backendSignKey,
    STAGE: envOverride,
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
                - yum install -y jq
            build:
              commands:
                - echo $secrets | jq -r "to_entries|map(\\\"\\(.key)=\\(.value|tostring)\\\")|.[]" > apps/vf-mvp/.env
                - echo "STAGE=$STAGE" >> apps/vf-mvp/.env
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

// AWS Parameter Store for Amplify Build step to access key and secret
new aws.ssm.Parameter(`${projectName}-amplifyUserAccessKeyParameter-${env}`, {
  tags,
  name: pulumi.interpolate`/amplify/${amplifyApp.id}/${amplifyBranchOverride}/AWS_ACCESS_KEY_ID`,
  type: 'SecureString',
  value: amplifyExecUserAccessKey.id,
});
// And secret
new aws.ssm.Parameter(
  `${projectName}-amplifyUserAccessSecretParameter-${env}`,
  {
    tags,
    name: pulumi.interpolate`/amplify/${amplifyApp.id}/${amplifyBranchOverride}/AWS_SECRET_ACCESS_KEY`,
    type: 'SecureString',
    value: amplifyExecUserAccessKey.secret,
  }
);

// Amplify branch, maps to track repo branch.
const trackedBranch = new aws.amplify.Branch(
  `${projectName}-amplify-branch-${env}`,
  {
    tags,
    appId: amplifyApp.id,
    branchName: amplifyBranchOverride,
    enableAutoBuild: false,
    description: `Tracks the ${amplifyBranchOverride} branch in Github.`,
    environmentVariables: {
      FRONTEND_ORIGIN_URI: pulumi.interpolate`${amplifyBranchOverride}.${amplifyApp.id}.amplifyapp.com`,
    },
  }
);

//
// Manually run build/deployment for specified branch
// Wait for deployment to finish, fail or timeout
//
pulumi
  .all([amplifyApp.id, trackedBranch.branchName])
  .apply(async ([appId, branchName]) => {
    if (pulumi.runtime.isDryRun()) {
      return;
    }

    const amplifyClient = new AmplifyClient({});

    try {
      const { jobSummary } = await amplifyClient.send(
        new StartJobCommand({
          appId,
          branchName,
          jobType: 'RELEASE',
          jobReason: 'Testing testing',
        })
      );

      if (jobSummary?.status === 'FAILED') {
        console.error(`Deployment failed on StartJobCommand`);
        throw 'StartJobCommand failure';
      }

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
              jobId: jobSummary?.jobId,
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
