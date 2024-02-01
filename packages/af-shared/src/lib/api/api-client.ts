import axios, { isAxiosError } from 'axios';
import { REQUEST_NOT_AUTHORIZED } from '../constants';
import { getValidAuthState } from '../utils/auth';
import { LoginState } from './services/auth';

// add custom configs (extended in axios.d.ts)
// override defaults where needed, when using apiClient
const apiClient = axios.create({
  idTokenRequired: false, // tells if 'Auhtorization' with bearer idtoken is required for the request headers
  csrfTokenRequired: false, // tells if 'x-csrf-token' is required for the request headers (af-mvp only)
  isTraceable: false, // tells if 'x-request-trace-id' is required for the request headers
});

apiClient.interceptors.request.use(async config => {
  if (config.url !== undefined && config.headers !== undefined) {
    // id token required
    if (config.idTokenRequired) {
      const idToken = (await LoginState.getLoggedInState())?.idToken;
      config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
    }

    // csrf token required (af-mvp)
    if (config.csrfTokenRequired) {
      config.headers['x-csrf-token'] = LoginState.getCsrfToken();
    }

    // Add traceId where applicable: 'isTraceable' found in config (af-mvp)
    if (config.isTraceable) {
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
    if (isAxiosError(error)) {
      // either no token, or it has expired
      const hasExpired = !(await getValidAuthState()).isValid;

      if (
        (error.config?.idTokenRequired || error.config?.csrfTokenRequired) &&
        hasExpired
      ) {
        if (!tokenExpirationAlertDisplayed) {
          tokenExpirationAlertDisplayed = true;
          window.postMessage(REQUEST_NOT_AUTHORIZED);
        }

        // essentially, silence the error for token expiration cases for UI
        return Promise.resolve();
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
