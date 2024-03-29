# Virtua Finland Authentication

The Virtual Finland solution for identity providing and authentication is based on AWS Cognito service. The solution applies a custom login flow of Cognito that implements an OTP (One Time Password) authentication with an email address. The email sending is implemented with AWS SES service that is set up in the [infrastructure](https://github.com/Virtual-Finland-Development/infrastructure)-project.

## Cognito User Pool

The pool that stores the user email addresses is created and managed with the pulumi deployment tools, more specifically with the [../infra/af-mvp/resources/cognito.ts](../infra/af-mvp/resources/cognito.ts) file. The pool is configured to use explicitly the custom auth flow with authentication triggers (lambda functions). The implementation follows the guidelines provided in the [AWS Cognito documentation (blog post)](https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/).

## The sign-in flow

The sign-in flow is implemented with the following steps:

1. The user enters their email address to the login form and submits the form
2. The frontend app sends a request to the cognito with the email address
3. The cognito generates an OTP code and stores it to the user session
4. The cognito sends an email with the OTP code to the user
5. The cognito responds to the frontend app with a success message
6. The frontend app shows the OTP code input field
7. The user enters the OTP code to the input field and submits the form
8. The frontend app sends a request to the cognito with the OTP code
9. The cognito verifies the OTP code and responds with a success message and a session token
10. The frontend app sends a request to the backend app with the session token
11. The backend app verifies the session token with the cognito, stores the session token to a secure cookie and responds with a success message
12. The user can now use the login session as a login method to the Access Finland application.

The frontend app flow is implemented in the [../apps/af-mvp/src/pages/auth/sign-in/index.page.tsx](../apps/af-mvp/src/pages/auth/sign-in/index.page.tsx) file, and the backend app routes are defined in the [../apps/af-mvp/src/pages/api/auth/system](../apps/af-mvp/src/pages/api/auth/system) folder.

The flow follows the same security principles as described in the [./README.af-mvp.security.md](./README.af-mvp.security.md) documents "Data Protection" heading.

## Local development

The local development requires the AWS Cognito service to be set up and running. The service could be set up locally using the pro/team-subscription to the localstack tooling or by using the live AWS environment. As the paid subscription is not available for the project the live environment is used for the development instead.

To set up the local development environment the following steps are required:

- setup the virtualfinland cognito user pool using the specially crafted pulumi deployment here: [../infra/af-mvp/for-local-dev/](../infra/af-mvp/for-local-dev/)
- from the deployment outputs, copy the user pool ID, client ID and the endpoint URL to the local environment variables in the [../apps/af-mvp/.env.local](../apps/af-mvp/.env.local)-file:
  ```bash
  NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ID=eu-north-1_XXXXXXXXX
  NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXX
  NEXT_PUBLIC_LOGIN_SYSTEM_COGNITO_USER_POOL_ENDPOINT=https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_XXXXXXXXX
  ```


If the cognito pool is not configured, the login attempt will fail with following error message: `Auth UserPool not configured`.