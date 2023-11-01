# apps/af-mvp

Access Finland MVP application, deployed to production. Only includes features defined in Virtual Finland MVP context.

## Features

- Authentication

  - Sinuna authentication

- Access Finland user profile
  - Person basic info (https://developer.testbed.fi/sources/available?search=Person%2FBasicInformation_v1.0)
  - Job applicant profile (https://developer.testbed.fi/sources/available?search=Person%2FJobApplicantProfile_v1.0)
  - Terms of Use feature enabled, otherwise shares the same implementation with `af-features`

## Tech

Next.js application, pages router (https://nextjs.org/docs/pages/building-your-application). Mix of client side fetching / API routes implementation.

## Dependencies

- users-api (https://github.com/Virtual-Finland-Development/users-api)
- codesets (https://github.com/Virtual-Finland-Development/codesets)