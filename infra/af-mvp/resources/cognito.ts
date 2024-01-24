import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as fs from 'fs';
import setup, { nameResource } from '../utils/setup';
import { CdnSetup, DomainSetup } from '../utils/types';
import { createDomainCertificateAndVerifyRecord } from './domainSetup';
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
  awsSetup: { region },
} = setup;

export function createWafCognitoUserPool(
  domainSetup: DomainSetup,
  callbackUri: pulumi.Output<string>
) {
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

  const { userPoolDomain, cognitoDomain } = createWafCognitoUserPoolDomain(
    userPool,
    domainSetup
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
      userPoolId: userPoolDomain.userPoolId,
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

function createWafCognitoUserPoolDomain(
  userPool: aws.cognito.UserPool,
  domainSetup: DomainSetup
) {
  // Create cognito domain for hosted UI login
  let loginDomainIdent = `${setup.projectName}-${setup.environment}`;
  let cognitoDomain = `${loginDomainIdent}.auth.${region}.amazoncognito.com`;

  let wafCustomDomainCertificateArn;

  // Custom domain setup: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
  if (domainSetup?.domainName && domainSetup?.zone) {
    loginDomainIdent = `${waf.customDomain.applicationSubDomain}.${waf.customDomain.cognitoSubDomain}.${domainSetup.domainName}`;
    cognitoDomain = loginDomainIdent;

    const customCertificate = createDomainCertificateAndVerifyRecord(
      domainSetup.zone,
      loginDomainIdent
    );
    wafCustomDomainCertificateArn = customCertificate.arn;

    const cognitoDomainRoot = `${waf.customDomain.cognitoSubDomain}.${domainSetup.domainName}`;

    // Root domain record for the user pool
    new aws.route53.Record(nameResource('wafCognitoDomainRecord'), {
      name: cognitoDomainRoot,
      type: 'A',
      zoneId: domainSetup.zone.id,
      records: ['198.51.100.1'], // Dummy IP, not actually in use (cognito requires a value)
      ttl: 300,
    });
  }

  const userPoolDomain = new aws.cognito.UserPoolDomain(
    nameResource('wafUserPoolDomain'),
    {
      domain: loginDomainIdent,
      userPoolId: userPool.id,
      certificateArn: wafCustomDomainCertificateArn,
    }
  );

  if (domainSetup?.domainName && domainSetup?.zone) {
    // Alias record for the cognito login UI
    new aws.route53.Record(nameResource('wafCognitoAliasRecord'), {
      name: loginDomainIdent,
      type: 'A',
      zoneId: domainSetup.zone.id,
      aliases: [
        {
          evaluateTargetHealth: true,
          name: userPoolDomain.cloudfrontDistribution,
          zoneId: userPoolDomain.cloudfrontDistributionZoneId,
        },
      ],
    });
  }

  return {
    userPoolDomain,
    cognitoDomain,
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
        temporaryPasswordValidityDays: 7,
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
