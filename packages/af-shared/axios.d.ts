import 'axios';

/**
 * Extend AxiosRequestConfig interface
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    idTokenRequired?: boolean; // tells if 'Auhtorization' with bearer idtoken is required for the request headers
    csrfTokenRequired?: boolean; // tells if 'x-csrf-token' is required for the request headers (af-mvp only)
    isTraceable?: boolean; // tells if 'x-request-trace-id' can be set to the request headers (af-mvp only)
  }
}
