import axios, { AxiosError, isAxiosError } from 'axios';
import { REQUEST_NOT_AUTHORIZED } from '../constants';
import { isExportedApplication } from '../utils';
import { getValidAuthState } from '../utils/auth';
import { CODESETS_BASE_URL } from './endpoints';
import { LoginState } from './services/auth';

// add custom configs (extended in axios.d.ts)
const apiClient = axios.create({
  idTokenRequired: false, // tells if 'Auhtorization' with bearer idtoken is required for the request headers
  csrfTokenRequired: false, // tells if 'x-csrf-token' is required for the request headers (af-mvp only)
});

// Used to check if request url starts with any of the following list
const NEXTJS_API_TRACEABLE_URIS = ['/api/', `${CODESETS_BASE_URL}/resources/`];

apiClient.interceptors.request.use(async config => {
  if (config.url !== undefined && config.headers !== undefined) {
    // id token required
    if (config.idTokenRequired) {
      const idToken = (await LoginState.getLoggedInState())?.idToken;
      config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';

      /* if (!config.headers['x-consent-token']) {
        config.headers['x-consent-token'] = '';
      } */
    }

    // csrf token required (af-mvp)
    if (config.csrfTokenRequired) {
      config.headers['x-csrf-token'] = LoginState.getCsrfToken();
    }

    // Add traceId where applicable: the url starts with one of the traceable uris and the application is not built in exported mode
    if (
      !isExportedApplication() &&
      NEXTJS_API_TRACEABLE_URIS.filter(uri => config.url?.startsWith(uri))
        .length
    ) {
      const { v4: uuidv4 } = await import('uuid'); // Lazy load uuid, as it's not needed in the exported application
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
      isAxiosError(error) &&
      (error.config?.idTokenRequired || error.config?.csrfTokenRequired) &&
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
