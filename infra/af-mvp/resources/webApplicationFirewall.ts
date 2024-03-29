import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import setup, { nameResource } from '../utils/setup';
import { DomainSetup } from '../utils/types';
import { createWafCognitoUserPool } from './cognito';

const {
  tags,
  cdn: { waf },
  getCurrentStackReference,
} = setup;

export async function createWebAppFirewallProtection(domainSetup: DomainSetup) {
  if (!waf.enabled) {
    return;
  }

  const appUrl = await getCurrentStackReference().getOutputValue('url');
  if (!appUrl) {
    console.log(
      "Skipped creating WAF as there's a circular dependency to the CDN which is not yet created."
    );
    return;
  }

  // Random value for shared cookie secret
  const sharedCookieSecret = pulumi.interpolate`${
    new random.RandomPassword(nameResource('wafCookieHash'), {
      length: 32,
      special: false,
    }).result
  }`;

  const callbackUri = pulumi.interpolate`${appUrl}/api/auth/cognito/callback`;
  const { userPool, userPoolClient, cognitoDomain } = createWafCognitoUserPool(
    domainSetup,
    callbackUri
  );

  const cognitoLoginUri = pulumi.interpolate`https://${cognitoDomain}/login?response_type=token&client_id=${userPoolClient.id}&redirect_uri=${callbackUri}`;

  // Create a firewall
  const firewallRegion = new aws.Provider(nameResource('aws-waf-region'), {
    region: 'us-east-1',
  });
  const webApplicationFirewall = new aws.wafv2.WebAcl(
    nameResource('webApplicationFirewall'),
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
          name: 'HealthCheckPassThrough',
          priority: 4,
          action: {
            allow: {},
          },
          statement: {
            byteMatchStatement: {
              searchString: '/api/health-check',
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
            metricName: 'HealthCheckPassThrough',
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
            metricName: nameResource('webApplicationFirewallGrantAccess'),
            sampledRequestsEnabled: true,
          },
        },
      ],
      scope: 'CLOUDFRONT',
      tags,
      visibilityConfig: {
        cloudwatchMetricsEnabled: true,
        metricName: nameResource('webApplicationFirewall'),
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
