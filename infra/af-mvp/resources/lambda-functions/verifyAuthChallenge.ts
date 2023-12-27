// @see: https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/
// @see: https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

import { VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';

export default async (event: VerifyAuthChallengeResponseTriggerEvent) => {
  const expectedAnswer =
    event.request.privateChallengeParameters!.secretLoginCode;
  if (event.request.challengeAnswer === expectedAnswer) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
};
