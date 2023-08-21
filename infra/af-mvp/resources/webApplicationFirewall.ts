import * as aws from "@pulumi/aws";
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import * as fs from "fs";

import setup, { nameResource } from '../utils/setup';

const {
    tags,
    cdn: {
      waf,
    },
    awsSetup: {
        region,
    },
    currentStackReference,
  } = setup;
  

export function createWebAppFirewallProtection() {
    
    if (!waf.enabled) {
        return;
    } else if (!waf.username || !waf.password) {
        throw new Error("WAF enabled but no username or password provided");
    }
 
    const cdnURL = currentStackReference.getOutput('cdnURL');
    if (!cdnURL) {
        console.log("Skipped creating WAF as it's a circular dependency to the CDN which is not yet created: you must run `pulumi up` again after the CDN is created.");
        return;
    }

    // Random value for shared cookie secret
    const sharedCookieSecret = pulumi.interpolate`${
        new random.RandomPassword(nameResource('wafCookieHash'), {
        length: 32,
        special: false
        }).result
    }`;

    const callbackUri = pulumi.interpolate`${cdnURL}/api/auth/cognito/callback`;
    const { userPool, userPoolClient, cognitoDomain } = createCognitoUserPool(callbackUri);

    const cognitoLoginUri = pulumi.interpolate`https://${cognitoDomain.domain}.auth.${region}.amazoncognito.com/login?response_type=token&client_id=${userPoolClient.id}&redirect_uri=${callbackUri}`

    // Create a firewall
    const firewallRegion = new aws.Provider(nameResource('aws-waf-region'), { region: 'us-east-1' });
    const webApplicationFirewall = new aws.wafv2.WebAcl(nameResource('webApplicationFirewall'), {
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
                        searchString: "/api/auth/cognito/callback",
                        fieldToMatch: {
                            uriPath: {}
                        },
                        textTransformations: [
                            {
                                priority: 0,
                                type: "NONE"
                            }
                        ],
                        positionalConstraint: "EXACTLY"
                    }
                },
                visibilityConfig: {
                    cloudwatchMetricsEnabled: true,
                    sampledRequestsEnabled: true,
                    metricName: "TryToGetAccess"
                }
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
                                        includedCookies: ['cognito-identity.amazonaws.com'],
                                    }
                                ],
                                oversizeHandling: "NO_MATCH",
                                matchScope: "VALUE",
                            }
                        },
                        textTransformations: [
                          {
                            priority: 0,
                            type: "NONE"
                          }
                        ],
                        positionalConstraint: "EXACTLY"
                      }
                },
                visibilityConfig: {
                    cloudwatchMetricsEnabled: true,
                    metricName: nameResource('webApplicationFirewallGrantAccess'),
                    sampledRequestsEnabled: true,
                },
            }
        ],
        scope: 'CLOUDFRONT',
        tags,
        visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: nameResource('webApplicationFirewall'),
            sampledRequestsEnabled: true,
        },
    }, { provider: firewallRegion }); // Cloudfrount WAF must be defined in us-east-1

    return {
        webApplicationFirewall,
        userPool,
        userPoolClient,
        sharedCookieSecret,
    }
}

function createCognitoUserPool(callbackUri: pulumi.Output<string>) {

    if (!waf.username || !waf.password) {
        throw new Error("Username and password must be set in the config");
    }

    const userPool = new aws.cognito.UserPool(nameResource('wafUserPool'), {
        adminCreateUserConfig: {
            allowAdminCreateUserOnly: true,
        },
        accountRecoverySetting: { // Required to have at least one recovery mechanism, not actually in use
            recoveryMechanisms: [
                {
                    name: "verified_email", 
                    priority: 1,
                },
            ],
        },
        tags,
    });

    // Create cognito domain for hosted UI login
    const loginDomainIdent = `${setup.projectName}-${setup.environment}`;
    const cognitoDomain = new aws.cognito.UserPoolDomain(nameResource('wafUserPoolDomain'), {
        domain: loginDomainIdent,
        userPoolId: userPool.id,
    });

    const userPoolClient = new aws.cognito.UserPoolClient(nameResource('wafUserPoolClient'), { 
        userPoolId: userPool.id,
        generateSecret: true,
        callbackUrls: [callbackUri], 
        allowedOauthFlowsUserPoolClient: true,
        allowedOauthFlows: [
            "implicit",
        ],
        allowedOauthScopes: [
            "openid",
        ],
        supportedIdentityProviders: ["COGNITO"],
    });
    const imageFile = fs.readFileSync("../../packages/af-shared/src/images/virtualfinland_logo_small.png");

    new aws.cognito.UserPoolUICustomization(nameResource('wafUserPoolUICustomization'), {
        clientId: userPoolClient.id,
        css: ".label-customizable {font-weight: 400;}",
        imageFile: imageFile.toString("base64"),
        userPoolId: cognitoDomain.userPoolId,
    });
    
    // Create a static user
    const user = new aws.cognito.User(nameResource("wafUser"), {
        userPoolId: userPool.id,
        username: waf.username,
        password: waf.password,
        messageAction: "SUPPRESS",
    });

    return  {
        cognitoDomain,
        userPool,
        userPoolClient,
        user,
    };
}