// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';

async function handler(event: PostAuthenticationTriggerEvent) {
  if (event.request.userAttributes.email_verified !== 'true') {
    const client = new CognitoIdentityProviderClient();
    const params = {
      UserPoolId: event.userPoolId,
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      Username: event.userName!,
    };
    await client.send(new AdminUpdateUserAttributesCommand(params));
  }
  return event;
}
export default handler;
