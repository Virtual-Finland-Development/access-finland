import { rest } from 'msw';
import {
  CODESETS_BASE_URL,
  PRH_MOCK_BASE_URL,
  TESTBED_API_BASE_URL,
} from '@/lib/api/endpoints';
import {
  MOCK_AUTH_STATE,
  MOCK_ISO_COUNTRIES,
  MOCK_JOB_APPLICANT_INFO,
  MOCK_PERSON_BASIC_INFO,
  MOCK_USER_COMPANIES,
} from './mock-values';

const userId = MOCK_AUTH_STATE.storedAuthState.profileData.userId;

export const handlers = [
  // companies
  rest.get(`${PRH_MOCK_BASE_URL}/users/${userId}/companies`, (_, res, ctx) =>
    res(ctx.json(MOCK_USER_COMPANIES))
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
