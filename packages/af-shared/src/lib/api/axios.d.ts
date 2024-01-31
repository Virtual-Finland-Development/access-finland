import 'axios';

/**
 * Extend AxiosRequestConfig interface
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    idTokenRequired?: boolean; // tells if 'Auhtorization' with bearer idtoken is required for the request headers
    csrfTokenRequired?: boolean; // tells if 'x-csrf-token' is required for the request headers (af-mvp only)
  }
}
