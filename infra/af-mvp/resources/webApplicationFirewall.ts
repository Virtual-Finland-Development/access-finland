import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import Setup from '../utils/Setup';
import { createCognitoUserPool } from './cognito';

export async function createWebAppFirewallProtection(setup: Setup) {
  if (!setup.cdn.waf.enabled) {
    return;
  }

  const appUrl = await setup.currentStackReference.getOutputValue('url');
  if (!appUrl) {
    console.log(
      "For now, skipped creating WAF as there's a circular dependency to the CDN which is not yet created."
    );
    return;
  }

  // Random value for shared cookie secret
  const sharedCookieSecret = pulumi.interpolate`${
    new random.RandomPassword(setup.nameResource('wafCookieHash'), {
      length: 32,
      special: false,
    }).result
  }`;

  const callbackUri = pulumi.interpolate`${appUrl}/api/auth/cognito/callback`;
  const { userPool, userPoolClient, cognitoDomain } = createCognitoUserPool(
    setup,
    callbackUri
  );

  const cognitoLoginUri = pulumi.interpolate`https://${cognitoDomain.domain}.auth.${setup.awsSetup.region}.amazoncognito.com/login?response_type=token&client_id=${userPoolClient.id}&redirect_uri=${callbackUri}`;

  // Create a firewall
  const firewallRegion = new aws.Provider(
    setup.nameResource('aws-waf-region'),
    {
      region: 'us-east-1',
    }
  );
  const webApplicationFirewall = new aws.wafv2.WebAcl(
    setup.nameResource('webApplicationFirewall'),
    {
      defaultAction: {
        block: {
          customResponse: {
            responseCode: 403,
            customResponseBodyKey: 'AccessDenied',
          },
        },
      },
      description: 'Locks the staging site for unauthorized users',
      customResponseBodies: [
        {
          key: 'AccessDenied',
          contentType: 'TEXT_HTML',
          content: pulumi.interpolate`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Access Denied</title>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="3;${cognitoLoginUri}">
                        <style>
                            body {
                                background: #909090;
                                color: #ffffff;
                                text-align: center;
                                font-family: "Arial";
                                font-size: 1.5em;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>ACCESS DENIED</h1>
                        <p><b>Redirecting</b> to the login page..</p>
                        <p>If you are not redirected, please follow the redirection link <a href="${cognitoLoginUri}">here</a>.</p>
                    </body>
                </html>
                `,
        },
      ],
      rules: [
        {
          name: 'TryToGetAccess',
          priority: 1,
          action: {
            allow: {},
          },
          statement: {
            byteMatchStatement: {
              searchString: '/api/auth/cognito/callback',
              fieldToMatch: {
                uriPath: {},
              },
              textTransformations: [
                {
                  priority: 0,
                  type: 'NONE',
                },
              ],
              positionalConstraint: 'EXACTLY',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            sampledRequestsEnabled: true,
            metricName: 'TryToGetAccess',
          },
        },
        {
          name: 'VerifyAccess',
          priority: 2,
          action: {
            allow: {},
          },
          statement: {
            byteMatchStatement: {
              searchString: '/api/auth/cognito/verify',
              fieldToMatch: {
                uriPath: {},
              },
              textTransformations: [
                {
                  priority: 0,
                  type: 'NONE',
                },
              ],
              positionalConstraint: 'EXACTLY',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            sampledRequestsEnabled: true,
            metricName: 'VerifyAccess',
          },
        },
        {
          name: 'PassThroughAssets',
          priority: 3,
          action: {
            allow: {},
          },
          statement: {
            orStatement: {
              statements: [
                {
                  byteMatchStatement: {
                    searchString: '.png',
                    fieldToMatch: {
                      uriPath: {},
                    },
                    textTransformations: [
                      {
                        priority: 0,
                        type: 'NONE',
                      },
                    ],
                    positionalConstraint: 'ENDS_WITH',
                  },
                },
                {
                  byteMatchStatement: {
                    searchString: '.ico',
                    fieldToMatch: {
                      uriPath: {},
                    },
                    textTransformations: [
                      {
                        priority: 0,
                        type: 'NONE',
                      },
                    ],
                    positionalConstraint: 'ENDS_WITH',
                  },
                },
              ],
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: false,
            sampledRequestsEnabled: false,
            metricName: 'PassThroughAssets',
          },
        },
        {
          name: 'GrantAccess',
          priority: 0,
          action: {
            allow: {},
          },
          statement: {
            byteMatchStatement: {
              searchString: sharedCookieSecret,
              fieldToMatch: {
                cookies: {
                  matchPatterns: [
                    {
                      includedCookies: ['wafCognitoSession'],
                    },
                  ],
                  oversizeHandling: 'NO_MATCH',
                  matchScope: 'VALUE',
                },
              },
              textTransformations: [
                {
                  priority: 0,
                  type: 'NONE',
                },
              ],
              positionalConstraint: 'EXACTLY',
            },
          },
          visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: setup.nameResource('webApplicationFirewallGrantAccess'),
            sampledRequestsEnabled: true,
          },
        },
      ],
      scope: 'CLOUDFRONT',
      tags: setup.tags,
      visibilityConfig: {
        cloudwatchMetricsEnabled: true,
        metricName: setup.nameResource('webApplicationFirewall'),
        sampledRequestsEnabled: true,
      },
    },
    { provider: firewallRegion }
  ); // Cloudfrount WAF must be defined in us-east-1

  return {
    webApplicationFirewall,
    userPool,
    userPoolClient,
    sharedCookieSecret,
  };
}
