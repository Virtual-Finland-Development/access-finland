// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cup = new CognitoIdentityServiceProvider();

export default async (event: PostAuthenticationTriggerEvent) => {
  if (event.request.userAttributes.email_verified !== 'true') {
    const params: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest =
      {
        UserPoolId: event.userPoolId,
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
        Username: event.userName!,
      };
    await cup.adminUpdateUserAttributes(params).promise();
  }
  return event;
};
