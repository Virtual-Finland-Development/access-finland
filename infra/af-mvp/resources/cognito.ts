import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as fs from 'fs';
import setup, { nameResource } from '../utils/setup';
import { CdnSetup } from '../utils/types';
import {
  createCreateAuthChallengeLambda,
  createDefineAuthChallengeLambda,
  createPostAuthenticationLambda,
  createPreSignUpLambda,
  createVerifyAuthChallengeResponseLambda,
} from './lambdaFunctions';

const {
  tags,
  cdn: { waf },
} = setup;

export function createWafCognitoUserPool(callbackUri: pulumi.Output<string>) {
  const userPool = new aws.cognito.UserPool(
    nameResource('wafUserPool'),
    {
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: true,
      },
      accountRecoverySetting: {
        // Required to have at least one recovery mechanism, not actually in use
        recoveryMechanisms: [
          {
            name: 'verified_email',
            priority: 1,
          },
        ],
      },
      tags,
    },
    { protect: true }
  ); // Delete only by overriding the resource protection manually

  // Create cognito domain for hosted UI login
  const loginDomainIdent = `${setup.projectName}-${setup.environment}`;
  const cognitoDomain = new aws.cognito.UserPoolDomain(
    nameResource('wafUserPoolDomain'),
    {
      domain: loginDomainIdent,
      userPoolId: userPool.id,
    }
  );

  const userPoolClient = new aws.cognito.UserPoolClient(
    nameResource('wafUserPoolClient'),
    {
      userPoolId: userPool.id,
      generateSecret: true,
      callbackUrls: [callbackUri],
      allowedOauthFlowsUserPoolClient: true,
      allowedOauthFlows: ['implicit'],
      allowedOauthScopes: ['openid'],
      supportedIdentityProviders: ['COGNITO'],
    }
  );
  const imageFile = fs.readFileSync(
    '../../packages/af-shared/src/images/virtualfinland_logo_small.png'
  );

  new aws.cognito.UserPoolUICustomization(
    nameResource('wafUserPoolUICustomization'),
    {
      clientId: userPoolClient.id,
      css: '.label-customizable {font-weight: 400;}',
      imageFile: imageFile.toString('base64'),
      userPoolId: cognitoDomain.userPoolId,
    }
  );

  if (waf.username && waf.password) {
    // Create a static user
    new aws.cognito.User(nameResource('wafUser'), {
      userPoolId: userPool.id,
      username: waf.username,
      password: waf.password,
      messageAction: 'SUPPRESS',
    });
  }

  return {
    cognitoDomain,
    userPool,
    userPoolClient,
  };
}

/**
 * Sinuna replacement login system
 *
 * @returns
 */
export function createLoginSystemCognitoUserPool(cdnSetup: CdnSetup) {
  const defineAuthChallengeLambda = createDefineAuthChallengeLambda();
  const verifyAuthChallengeResponseLambda =
    createVerifyAuthChallengeResponseLambda();
  const createAuthChallengeLambda = createCreateAuthChallengeLambda(cdnSetup);
  const preSignUpLambda = createPreSignUpLambda();
  const postAuthenticationLambda = createPostAuthenticationLambda();

  const userPool = new aws.cognito.UserPool(
    nameResource('loginSystemsUserPool'),
    {
      lambdaConfig: {
        defineAuthChallenge: defineAuthChallengeLambda.arn,
        createAuthChallenge: createAuthChallengeLambda.arn,
        verifyAuthChallengeResponse: verifyAuthChallengeResponseLambda.arn,
        preSignUp: preSignUpLambda.arn,
        postAuthentication: postAuthenticationLambda.arn,
      },
      accountRecoverySetting: {
        // Note: not actually in use, required to have at least one recovery mechanism
        recoveryMechanisms: [
          {
            name: 'verified_email',
            priority: 1,
          },
        ],
      },
      passwordPolicy: {
        // Note: passwords not actually in use
        minimumLength: 30,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      tags,
    },
    { protect: true } // Delete only by overriding the resource protection manually
  );

  // Setup lambda invoking permissions
  new aws.lambda.Permission(nameResource('invoke-defineAuthChallenge'), {
    action: 'lambda:InvokeFunction',
    principal: 'cognito-idp.amazonaws.com',
    sourceArn: userPool.arn,
    function: defineAuthChallengeLambda.arn,
  });
  new aws.lambda.Permission(
    nameResource('invoke-verifyAuthChallengeResponse'),
    {
      action: 'lambda:InvokeFunction',
      principal: 'cognito-idp.amazonaws.com',
      sourceArn: userPool.arn,
      function: verifyAuthChallengeResponseLambda.arn,
    }
  );
  new aws.lambda.Permission(nameResource('invoke-createAuthChallenge'), {
    action: 'lambda:InvokeFunction',
    principal: 'cognito-idp.amazonaws.com',
    sourceArn: userPool.arn,
    function: createAuthChallengeLambda.arn,
  });
  new aws.lambda.Permission(nameResource('invoke-preSignUp'), {
    action: 'lambda:InvokeFunction',
    principal: 'cognito-idp.amazonaws.com',
    sourceArn: userPool.arn,
    function: preSignUpLambda.arn,
  });
  new aws.lambda.Permission(nameResource('invoke-postAuthentication'), {
    action: 'lambda:InvokeFunction',
    principal: 'cognito-idp.amazonaws.com',
    sourceArn: userPool.arn,
    function: postAuthenticationLambda.arn,
  });

  // Pool client
  const userPoolClient = new aws.cognito.UserPoolClient(
    nameResource('loginSystemsUserPoolClient'),
    {
      userPoolId: userPool.id,
      generateSecret: false,
      explicitAuthFlows: ['CUSTOM_AUTH_FLOW_ONLY'],
      preventUserExistenceErrors: 'ENABLED',
    }
  );

  return {
    userPool,
    userPoolClient,
  };
}
