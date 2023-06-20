import * as pulumi from '@pulumi/pulumi';
import { configureAmplify } from './resources/amplify';
import { configureIamUser } from './resources/iam';
import { configureParameterStore } from './resources/parameter-store';

// IAM user configs
const { amplifyExecUserAccessKey } = configureIamUser();

// Amplify configs
const { amplifyApp, trackedBranch, deployTrackedBranch } = configureAmplify();

// Parameter store configs
configureParameterStore(amplifyApp.id, amplifyExecUserAccessKey);

// Run amplify branch deployment
deployTrackedBranch();

// Export the App URL (maps to created branch)
export const appUrl = pulumi.interpolate`${trackedBranch.branchName}.${amplifyApp.defaultDomain}`;
