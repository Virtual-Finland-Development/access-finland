import * as aws from "@pulumi/aws";
import * as pulumi from '@pulumi/pulumi';
import * as fs from "fs";

import setup, { nameResource } from '../utils/setup';

const {
    tags,
    cdn: {
      waf: {
        username,
        password,
      }
    },
    awsSetup: {
        region,
    },
  } = setup;
  

export function createWebAppFirewallProtection(cdn: aws.cloudfront.Distribution) {
    
    if (!username || !password) {
        console.log("> Skipping WAF setup");
        return;
    }
    const sharedCookieSecret = "terde";
    
    const callbackUri = pulumi.interpolate`https://${cdn.domainName}/api/auth/cognito/callback`;
    const { userPool, userPoolClient, cognitoDomain } = createCognitoUserPool(callbackUri);

    const cognitoLoginUri = pulumi.interpolate`https://${cognitoDomain.domain}.auth.${region}.amazoncognito.com/login?response_type=token&client_id=${userPoolClient.id}&redirect_uri=${callbackUri}`

    // Create a firewall
    const firewallRegion = new aws.Provider(nameResource('aws-waf-region'), { region: 'us-east-1' });
    new aws.wafv2.WebAcl(nameResource('webApplicationFirewall'), {
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
                        <meta http-equiv="refresh" content="5;${cognitoLoginUri}">
                    </head>
                    <body>
                        <h1>You are not authorized to access this resource</h1>
                        <p>Redirecting to the login page in 5 seconds..</p>
                        <p>If you are not redirected, please click <a href="${cognitoLoginUri}">here</a>.</p>
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

    // Attach the firewall to the CDN
    // TODO: This is not working, need to figure out why: must be a malfunc in pulumi-terraform translation. 
    // The link between the WAF and the CDN must be done manually for now.
   /*  const webApplicationFirewallAssociation = new aws.wafv2.WebAclAssociation(nameResource('webApplicationFirewallAssociation'), {
        resourceArn: cdn.arn,
        webAclArn: webApplicationFirewall.arn,
    }); */
    
    return {
        cognitoDomain,
        userPool,
        userPoolClient,
        sharedCookieSecret,
        cognitoLoginUri,
    }
}

function createCognitoUserPool(callbackUri: pulumi.Output<string>) {

    if (!username || !password) {
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
        username: username,
        password: password,
        messageAction: "SUPPRESS",
    });

    return  {
        cognitoDomain,
        userPool,
        userPoolClient,
        user,
    };
}