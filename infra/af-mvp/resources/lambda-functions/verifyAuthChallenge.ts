// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

import { VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';

async function handler(event: VerifyAuthChallengeResponseTriggerEvent) {
  const expectedAnswer =
    event.request.privateChallengeParameters!.secretLoginCode;
  event.response.answerCorrect =
    event.request.challengeAnswer === expectedAnswer;
  return event;
}

export default handler;
