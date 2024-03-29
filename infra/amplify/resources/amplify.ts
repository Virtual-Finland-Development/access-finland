import {
  AmplifyClient,
  GetJobCommand,
  StartJobCommand,
} from '@aws-sdk/client-amplify';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  envOverride,
  githubAccessToken,
  externalApis: { codesetsEndpoint, usersApiEndpoint },
  backendSignKey,
  amplifyBranchOverride,
} = setup;

export function configureAmplify() {
  // Fetch the AWS pre-configured service role for Amplify
  const amplifyServiceRole = pulumi.output(
    aws.iam.getRole({ name: 'amplifyconsole-backend-role' })
  );

  const dataspaceConfig = new pulumi.Config('dataspace');

  // Next.js Amplify App
  const amplifyApp = new aws.amplify.App(nameResource('amplifyApp'), {
    tags,
    repository: 'https://github.com/Virtual-Finland-Development/access-finland',
    accessToken: githubAccessToken,
    iamServiceRoleArn: amplifyServiceRole.arn,
    enableAutoBranchCreation: false,
    enableBranchAutoBuild: false,
    enableBranchAutoDeletion: false,
    environmentVariables: {
      AMPLIFY_MONOREPO_APP_ROOT: 'apps/af-mvp',
      AMPLIFY_DIFF_DEPLOY: 'false',
      NEXT_PUBLIC_CODESETS_BASE_URL: codesetsEndpoint,
      NEXT_PUBLIC_USERS_API_BASE_URL: usersApiEndpoint,
      BACKEND_SECRET_SIGN_KEY: backendSignKey,
      NEXT_PUBLIC_STAGE: envOverride,
      DATASPACE_PRODUCT_GATEWAY_BASE_URL: dataspaceConfig.require('gatewayUrl'),
      DATASPACE_DEFAULT_DATA_SOURCE:
        dataspaceConfig.require('defaultDataSource'),
      DATASPACE_DEFAULT_SCHEMA_VERSION: dataspaceConfig.require(
        'defaultSchemaVersion'
      ),
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
                  - echo $secrets | jq -r "to_entries|map(\\\"\\(.key)=\\(.value|tostring)\\\")|.[]" > apps/af-mvp/.env
                  - echo "NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE" >> apps/af-mvp/.env
                  - echo "FRONTEND_ORIGIN_URI=$FRONTEND_ORIGIN_URI" >> apps/af-mvp/.env
                  - echo "BACKEND_SECRET_SIGN_KEY=$BACKEND_SECRET_SIGN_KEY" >> apps/af-mvp/.env
                  - echo "DATASPACE_PRODUCT_GATEWAY_BASE_URL=$DATASPACE_PRODUCT_GATEWAY_BASE_URL" >> apps/af-mvp/.env
                  - echo "DATASPACE_DEFAULT_DATA_SOURCE=$DATASPACE_DEFAULT_DATA_SOURCE" >> apps/af-mvp/.env
                  - echo "DATASPACE_DEFAULT_SCHEMA_VERSION=$DATASPACE_DEFAULT_SCHEMA_VERSION" >> apps/af-mvp/.env
                  - npx turbo run build --filter=af-mvp
            artifacts:
              baseDirectory: apps/af-mvp/.next
              files:
                - '**/*'
            cache:
              paths:
                - node_modules/**/*
            buildPath: /
          appRoot: apps/af-mvp
    `,
  });

  // Amplify branch, maps to track repo branch.
  const trackedBranch = new aws.amplify.Branch(nameResource('amplify-branch'), {
    tags,
    appId: amplifyApp.id,
    branchName: amplifyBranchOverride,
    enableAutoBuild: false,
    description: `Tracks the ${amplifyBranchOverride} branch in Github.`,
    environmentVariables: {
      FRONTEND_ORIGIN_URI: pulumi.interpolate`https://${amplifyBranchOverride}.${amplifyApp.id}.amplifyapp.com`,
    },
  });

  return {
    amplifyApp,
    trackedBranch,
  };
}

export function deployTrackedBranch(
  amplifyAppId: pulumi.Output<string>,
  trackedBranchName: pulumi.Output<string>
) {
  //
  // Manually run build/deployment for specified branch
  // Wait for deployment to finish, fail or timeout
  //
  pulumi
    .all([amplifyAppId, trackedBranchName])
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
          let timeoutCountdownSecs = 600; // 10 minutes timeout

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
}
