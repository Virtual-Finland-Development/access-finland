# apps/af-features

Access Finland demo application. Contains experimental/demo features not to be deployed to production environment. Can be used to further develop demo features in Virtual Finland / Access Finland context.

## Features

- Authentication

  - Testbed dummy authentication

- Access Finland user profile
  - Person basic info (https://developer.testbed.fi/sources/available?search=Person%2FBasicInformation_v1.0)
  - Job applicant profile (https://developer.testbed.fi/sources/available?search=Person%2FJobApplicantProfile_v1.0)
  - Terms of Use feature not enabled, otherwise shares the same implementation with `af-mvp`
- PRH mock (Patentti- ja rekisterihallitus) company establishment (NSG case)
  - Establish a non-listed company (https://developer.testbed.fi/sources/available?search=draft%2FNSG%2FAgent%2FLegalEntity%2FNonListedCompany%2FEstablishment%2FWrite)
  - Beneficial owners of a non-listed company (https://developer.testbed.fi/sources/available?search=draft%2FNSG%2FAgent%2FLegalEntity%2FNonListedCompany%2FBeneficialOwners)
  - Signatory rights of a non-listed company (https://developer.testbed.fi/sources/available?search=draft%2FNSG%2FAgent%2FLegalEntity%2FNonListedCompany%2FSignatoryRights)
- Seasonal employee case (kausityöntekijäkokeilu)
  - Permits/WorkPermit, read only (https://developer.testbed.fi/sources/available?search=Permits%2FWorkPermit_v0.1)
  - Employment/IncomeTax, read only (https://developer.testbed.fi/sources/available?search=Employment%2FIncomeTax_v0.2)
  - Employment/WorkContract, read only (https://developer.testbed.fi/sources/available?search=Employment%2FWorkContract_v0.3)

## Tech

Next.js static site application (SPA), pages router (https://nextjs.org/docs/pages/building-your-application/deploying/static-exports).

## Dependencies

- authentication-gw (https://github.com/Virtual-Finland-Development/authentication-gw)
- testbed-api (https://github.com/Virtual-Finland-Development/testbed-api)
- users-api (https://github.com/Virtual-Finland-Development/users-api)
- codesets (https://github.com/Virtual-Finland-Development/codesets)
- prh-mock (https://github.com/Virtual-Finland-Development/prh-mock)
- Job Market Finland external API (https://tyomarkkinatori.fi/hakupalvelu/api/1.0/skillrecommendation/skillrecommendation/)
