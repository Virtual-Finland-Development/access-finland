import * as pulumi from '@pulumi/pulumi';
import { configureAmplify } from './resources/amplify';
import { configureIamUser } from './resources/iam';

// Amplify configs
const { amplifyApp, trackedBranch } = configureAmplify();
// IAM user configs
configureIamUser(amplifyApp.id);

// Export the App URL (maps to created branch)
export const appUrl = pulumi.interpolate`${trackedBranch.branchName}.${amplifyApp.defaultDomain}`;
