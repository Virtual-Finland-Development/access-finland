import { LoggedInState } from '@/types';
import { isExportedApplication } from '.';
import apiClient from '../api/api-client';
import { LOCAL_STORAGE_AUTH_KEY, LOCAL_STORAGE_CSRF_KEY } from '../constants';
import { JSONLocalStorage } from './JSONStorage';

export class LoggedInStateMachine {
  inMemoryLoggedInState: LoggedInState;

  async getLoggedInState(): Promise<LoggedInState | null> {
    if (isExportedApplication()) {
      return this.getStaticExportedAppLoggedInState();
    }
    return this.getNextJsBackendAppLoggedInState();
  }

  async clear() {
    if (isExportedApplication()) {
      JSONLocalStorage.remove(LOCAL_STORAGE_AUTH_KEY);
    } else {
      this.inMemoryLoggedInState = undefined;
    }
  }

  async setLoggedInState(loggedInState: LoggedInState) {
    if (!isExportedApplication()) {
      throw new Error(
        'setLoggedInState should not be called in non-exported applications'
      );
    } else {
      JSONLocalStorage.set(LOCAL_STORAGE_AUTH_KEY, loggedInState);
    }
  }

  /**
   * "Login" to the backend
   *
   * @param csrfToken
   */
  setCsrfToken(csrfToken: string) {
    if (isExportedApplication()) {
      throw new Error(
        'setCsrfToken should not be called in exported applications'
      );
    }
    JSONLocalStorage.set(LOCAL_STORAGE_CSRF_KEY, csrfToken);
  }

  /**
   * Retrieve the backend csrf token
   *
   * @param csrfToken
   */
  getCsrfToken() {
    if (isExportedApplication()) {
      throw new Error(
        'getCsrfToken should not be called in exported applications'
      );
    }
    return JSONLocalStorage.get(LOCAL_STORAGE_CSRF_KEY);
  }

  /**
   * Login state of nextjs app with backend server capabilities
   */
  private async getNextJsBackendAppLoggedInState(): Promise<LoggedInState | null> {
    if (typeof this.inMemoryLoggedInState !== 'undefined') {
      return this.inMemoryLoggedInState;
    }
    this.inMemoryLoggedInState = null; // null means not logged in, keeps react from doing infinite things

    const csrfToken = JSONLocalStorage.get(LOCAL_STORAGE_CSRF_KEY);
    if (csrfToken) {
      try {
        this.inMemoryLoggedInState = await this.retrieveCurrentLoggedInState(
          csrfToken
        );
      } catch (e) {
        JSONLocalStorage.remove(LOCAL_STORAGE_CSRF_KEY);
      }
    }

    return this.inMemoryLoggedInState;
  }

  private async retrieveCurrentLoggedInState(
    csrfToken: string
  ): Promise<LoggedInState | null> {
    const response = await apiClient.post('/api/auth/retrieve-state', null, {
      headers: {
        'x-csrf-token': csrfToken,
      },
    });

    if (response?.status !== 200) {
      throw new Error('Unauthorized');
    }

    return response.data.state;
  }

  /**
   * Login state for static exported app
   */
  private async getStaticExportedAppLoggedInState(): Promise<LoggedInState | null> {
    return JSONLocalStorage.get(LOCAL_STORAGE_AUTH_KEY);
  }
}
