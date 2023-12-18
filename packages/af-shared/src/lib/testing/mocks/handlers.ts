import { rest } from 'msw';
import {
  CODESETS_BASE_URL,
  PRH_MOCK_BASE_URL,
  TESTBED_API_BASE_URL,
} from '@/lib/api/endpoints';
import {
  MOCK_AUTH_STATE,
  MOCK_INCOME_TAX,
  MOCK_ISO_COUNTRIES,
  MOCK_JOB_APPLICANT_INFO,
  MOCK_PERSON_BASIC_INFO,
  MOCK_TOS_AGREEMENT,
  MOCK_USER_COMPANIES,
  MOCK_WORK_PERMITS,
} from './mock-values';

const userId = MOCK_AUTH_STATE.storedAuthState.profileData.userId;

export const handlers = [
  // companies
  rest.get(`${PRH_MOCK_BASE_URL}/users/${userId}/companies`, (_, res, ctx) =>
    res(ctx.json(MOCK_USER_COMPANIES))
  ),
  // profile tos
  rest.get('http://localhost/api/users-api/terms-of-service', (_, res, ctx) =>
    res(ctx.json(MOCK_TOS_AGREEMENT))
  ),
  // profile
  rest.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
    (_, res, ctx) => res(ctx.json(MOCK_PERSON_BASIC_INFO))
  ),
  rest.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
    (_, res, ctx) => res(ctx.json(MOCK_JOB_APPLICANT_INFO))
  ),
  rest.post(
    'http://localhost/api/dataspace/Person/BasicInformation',
    (_, res, ctx) => res(ctx.json(MOCK_PERSON_BASIC_INFO))
  ),
  rest.post(
    'http://localhost/api/dataspace/Person/JobApplicantProfile',
    (_, res, ctx) => res(ctx.json(MOCK_JOB_APPLICANT_INFO))
  ),
  // work permits
  rest.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Permits/WorkPermit_v0.1`,
    (_, res, ctx) => res(ctx.json(MOCK_WORK_PERMITS))
  ),
  // income tax
  rest.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Employment/IncomeTax_v0.2`,
    (_, res, ctx) => res(ctx.json(MOCK_INCOME_TAX))
  ),
  // codesets, add values as needed for tests
  rest.get(
    `${CODESETS_BASE_URL}/resources/ISO3166CountriesURL`,
    (_, res, ctx) => res(ctx.json(MOCK_ISO_COUNTRIES))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/OccupationsFlatURL`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/ISO639Languages`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/WorkPermits`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/Regions`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/Municipalities`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/Skills`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/EducationFields`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/LevelsOfEducation`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(
    `${CODESETS_BASE_URL}/resources/SuomiFiKoodistotNace`,
    (_, res, ctx) => res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/EscoLanguages`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(
    `${CODESETS_BASE_URL}/resources/LanguageSkillLevels`,
    (_, res, ctx) => res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/OccupationsFlatURL`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/ISO639Languages`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get(`${CODESETS_BASE_URL}/resources/WorkPermits`, (_, res, ctx) =>
    res(ctx.json([]))
  ),
];
