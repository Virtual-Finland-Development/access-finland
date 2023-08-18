import { AdminCreateUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import * as aws from "@pulumi/aws";

import setup, { nameResource } from '../utils/setup';

const {
    tags,
    cdn: {
      waf: {
        username,
        password,
      }
    }
  } = setup;
  

export function createWebAppFirewallProtection(cdn: aws.cloudfront.Distribution) {
    
    if (!username || !password) {
        return;
    }
    
    const cognitoUserPool = createCognitoUserPool();

    // Create a firewall
    const firewallRegion = new aws.Provider(nameResource('aws-waf-region'), {region: 'us-east-1'});
    const webApplicationFirewall = new aws.wafv2.WebAcl(nameResource('webApplicationFirewall'), {
        defaultAction: {
            allow: {},
        },
        scope: 'CLOUDFRONT',
        tags,
        visibilityConfig: {
            cloudwatchMetricsEnabled: true,
            metricName: nameResource('webApplicationFirewall'),
            sampledRequestsEnabled: true,
        },
    }, { provider: firewallRegion });

    new aws.wafv2.WebAclAssociation(nameResource('webApplicationFirewallUserPoolAssociation'), {
        resourceArn: cognitoUserPool.arn,
        webAclArn: webApplicationFirewall.arn,
    });

    // Attach the firewall to the CDN
    new aws.wafv2.WebAclAssociation(nameResource('webApplicationFirewallCdnAssociation'), {
        resourceArn: cdn.arn,
        webAclArn: webApplicationFirewall.arn,
    }, { provider: firewallRegion });
}

function createCognitoUserPool() {

    if (!username || !password) {
        throw new Error("Username and password must be set in the config");
    }

    const userPool = new aws.cognito.UserPool(nameResource('wafUserPool'), {
        adminCreateUserConfig: {
            allowAdminCreateUserOnly: true,
        },
        tags,
    });

    // Create a static user
    userPool.id.apply(userPoolId => {
        const client = new CognitoIdentityProviderClient({ region: aws.config.region });
        const command = new AdminCreateUserCommand({
            UserPoolId: userPoolId,
            Username: username,
            TemporaryPassword: password,
            MessageAction: "SUPPRESS",
        });

        client.send(command).then((response: any) => {
            console.log("Cognito user created:", response);
        })
        .catch((error: any) => {
            if (error.name !== 'UsernameExistsException') {
                console.error("Error creating Cognito user:", error);
            }
        });
    });

    return userPool;
}