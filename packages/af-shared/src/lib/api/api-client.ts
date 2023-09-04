import axios from 'axios';
import { REQUEST_NOT_AUTHORIZED } from '../constants';
import { getValidAuthState } from '../utils/auth';
import { PRH_MOCK_BASE_URL, TESTBED_API_BASE_URL } from './endpoints';
import { LoginState } from './services/auth';

const apiClient = axios.create({});

const PROTECTED_URLS = [
  `${PRH_MOCK_BASE_URL}/draft/NSG/Agent/LegalEntity/NonListedCompany/Establishment`,
  `${PRH_MOCK_BASE_URL}/draft/NSG/Agent/LegalEntity/NonListedCompany/Establishment/Write`,
  `${PRH_MOCK_BASE_URL}/draft/NSG/Agent/LegalEntity/NonListedCompany/BeneficialOwners/Write`,
  `${PRH_MOCK_BASE_URL}/draft/NSG/Agent/LegalEntity/NonListedCompany/SignatoryRights/Write`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/establishment`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/beneficial-owners`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/non-listed-company/signatory-rights`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
  `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
  `${TESTBED_API_BASE_URL}/users-api/user`,
];

const NEXTJS_API_PROTECTED_URLS = [
  '/api/testbed-gw/draft/Person/BasicInformation',
  '/api/testbed-gw/draft/Person/BasicInformation/Write',
  '/api/testbed-gw/draft/Person/JobApplicantProfile',
  '/api/testbed-gw/draft/Person/JobApplicantProfile/Write',
  '/api/users-api',
  '/api/jmf/recommendations',
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
