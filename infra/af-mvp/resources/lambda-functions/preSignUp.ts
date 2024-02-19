// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

import { PreSignUpTriggerEvent } from 'aws-lambda';

async function handler(event: PreSignUpTriggerEvent) {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  return event;
}
export default handler;
