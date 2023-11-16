import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { REQUEST_NOT_AUTHORIZED } from '../constants';
import { getValidAuthState } from '../utils/auth';
import {
  CODESETS_BASE_URL,
  PRH_MOCK_BASE_URL,
  TESTBED_API_BASE_URL,
} from './endpoints';
import { LoginState } from './services/auth';

const apiClient = axios.create({});

const PROTECTED_URLS = [
  `${PRH_MOCK_BASE_URL}/NSG/Agent/LegalEntity/NonListedCompany/Establishment_v1.0`,
  `${PRH_MOCK_BASE_URL}/NSG/Agent/LegalEntity/NonListedCompany/Establishment/Write_v1.0`,
  `${PRH_MOCK_BASE_URL}/NSG/Agent/LegalEntity/NonListedCompany/BeneficialOwners/Write_v1.0`,
  `${PRH_MOCK_BASE_URL}/NSG/Agent/LegalEntity/NonListedCompany/SignatoryRights/Write_v1.0`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/establishment`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/beneficial-owners`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/signatory-rights`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
  `${TESTBED_API_BASE_URL}/users-api/user`,
];

const NEXTJS_API_PROTECTED_URLS = [
  '/api/dataspace/Person/BasicInformation',
  '/api/dataspace/Person/BasicInformation/Write',
  '/api/dataspace/Person/JobApplicantProfile',
  '/api/dataspace/Person/JobApplicantProfile/Write',
  '/api/users-api',
  '/api/jmf/recommendations',
  '/api/users-api/terms-of-service',
];

// Used to check if request url starts with any of the following list
const NEXTJS_API_TRACEABLE_URIS = [
  '/api/users-api/',
  `${CODESETS_BASE_URL}/resources/`,
];

function isProtectedNextJsEndpoint(url: string): boolean {
  for (const nextJsEndpoint of NEXTJS_API_PROTECTED_URLS) {
    if (url.includes(nextJsEndpoint)) {
      return true;
    }
  }
  return false;
}

apiClient.interceptors.request.use(async config => {
  if (config.url !== undefined && config.headers !== undefined) {
    if (PROTECTED_URLS.includes(config.url)) {
      const idToken = (await LoginState.getLoggedInState())?.idToken;
      config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
      config.headers['x-consent-token'] = '';
    } else if (isProtectedNextJsEndpoint(config.url)) {
      config.headers['x-csrf-token'] = LoginState.getCsrfToken();
    }

    // Add traceId if applicable
    if (
      NEXTJS_API_TRACEABLE_URIS.filter(uri => config.url?.startsWith(uri))
        .length
    ) {
      config.headers['x-request-trace-id'] = uuidv4();
    }
  }

  return config;
});

// set global flag to avoid multiple alerts popping up
// this will be reset when the user logs in again (auth redirect)
let tokenExpirationAlertDisplayed = false;

apiClient.interceptors.response.use(
  response => response,
  async error => {
    // either no token, or it has expired
    const hasExpired = !(await getValidAuthState()).isValid;

    if (
      error.config?.url &&
      (PROTECTED_URLS.includes(error.config.url) ||
        isProtectedNextJsEndpoint(error.config.url)) &&
      hasExpired
    ) {
      if (!tokenExpirationAlertDisplayed) {
        tokenExpirationAlertDisplayed = true;
        window.postMessage(REQUEST_NOT_AUTHORIZED);
      }

      // essentially, silence the error for token expiration cases for UI
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default apiClient;
