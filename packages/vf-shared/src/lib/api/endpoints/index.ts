import { removeTrailingSlash } from '@/lib/utils';

export const AUTH_GW_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_GW_BASE_URL ||
  'https://virtualfinland-authgw.localhost';

export const PRH_MOCK_BASE_URL = process.env.NEXT_PUBLIC_PRH_MOCK_BASE_URL
  ? removeTrailingSlash(process.env.NEXT_PUBLIC_PRH_MOCK_BASE_URL)
  : 'http://localhost:5059';

export const TESTBED_API_BASE_URL = process.env.NEXT_PUBLIC_TESTBED_API_BASE_URL
  ? removeTrailingSlash(process.env.NEXT_PUBLIC_TESTBED_API_BASE_URL)
  : 'http://localhost:3003';

export const CODESETS_BASE_URL = process.env.NEXT_PUBLIC_CODESETS_BASE_URL
  ? removeTrailingSlash(process.env.NEXT_PUBLIC_CODESETS_BASE_URL)
  : 'http://localhost:3166';

export const USERS_API_BASE_URL = process.env.NEXT_PUBLIC_USERS_API_BASE_URL
  ? removeTrailingSlash(process.env.NEXT_PUBLIC_USERS_API_BASE_URL)
  : 'http://localhost:5001';

export const JMF_SKILL_RECOMMENDATIONS_ENDPOINT = process.env.JMF_SKILL_RECOMMENDATIONS_ENDPOINT 
  ? process.env.JMF_SKILL_RECOMMENDATIONS_ENDPOINT
  : "https://tyomarkkinatori.fi/hakupalvelu/api/1.0/skillrecommendation/skillrecommendation/";