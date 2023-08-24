import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as fs from 'fs';
import setup, { nameResource } from '../utils/setup';

const {
  tags,
  cdn: { waf },
} = setup;

export function createCognitoUserPool(callbackUri: pulumi.Output<string>) {
  const userPool = new aws.cognito.UserPool(nameResource('wafUserPool'), {
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
  }, { protect: true }); // Delete only by overriding the resource protection manually

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
