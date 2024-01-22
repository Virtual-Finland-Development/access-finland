/* eslint-disable turbo/no-undeclared-env-vars */
// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth
import {
  SESv2Client,
  SendEmailCommand,
  SendEmailRequest,
} from '@aws-sdk/client-sesv2';
import { CreateAuthChallengeTriggerEvent } from 'aws-lambda';
import { randomDigits } from 'crypto-secure-random-digit';
import { createEmailContentForCodeConfirmation } from './utils/email';

/**
 * @see: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sesv2/command/SendEmailCommand/
 * @param emailAddress
 * @param secretLoginCode
 */
async function sendEmail(emailAddress: string, secretLoginCode: string) {
  const client = new SESv2Client();
  const input: SendEmailRequest = {
    FromEmailAddress: process.env.SES_FROM_ADDRESS!,
    Destination: {
      // Destination
      ToAddresses: [
        // EmailAddressList
        emailAddress,
      ],
    },
    Content: createEmailContentForCodeConfirmation(
      secretLoginCode,
      emailAddress
    ),
    EmailTags: [
      // MessageTagList
      {
        // MessageTag
        Name: 'name',
        Value: 'createAuthChallenge',
      },
    ],
    ConfigurationSetName: 'af-ses-configuration-set',
  };
  await client.send(new SendEmailCommand(input));
}

/**
 * The createAuthChallenge trigger is invoked when a user submits their email to sign in
 *
 * @param event
 * @returns
 */
const createAuthChallenge = async (event: CreateAuthChallengeTriggerEvent) => {
  let secretLoginCode: string;
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session

    // Fail auth if no email was provided (happens when signin before signup)
    if (!event.request.userAttributes.email) {
      throw new Error('UserNotFoundException: Not provided.');
    }

    // Generate a new secret login code and mail it to the user
    secretLoginCode = randomDigits(6).join('');
    await sendEmail(event.request.userAttributes.email, secretLoginCode);
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // the needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode =
      previousChallenge.challengeMetadata!.match(/CODE-(\d*)/)![1];
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

export default createAuthChallenge;
