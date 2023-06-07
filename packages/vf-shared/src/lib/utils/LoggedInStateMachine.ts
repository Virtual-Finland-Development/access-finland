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
    if (isExportedApplication()) {
      JSONLocalStorage.set(LOCAL_STORAGE_AUTH_KEY, loggedInState);
    } else {
      this.inMemoryLoggedInState = loggedInState;
      JSONLocalStorage.set(LOCAL_STORAGE_CSRF_KEY, loggedInState.csrfToken);
    }
  }

  /**
   * Login state of nextjs app with backend server capabilities
   */
  private async getNextJsBackendAppLoggedInState(): Promise<LoggedInState | null> {
    if (typeof this.inMemoryLoggedInState !== 'undefined') {
      return this.inMemoryLoggedInState;
    }
    this.inMemoryLoggedInState = null; // null means not logged in, keeps react from doing infinite things

    const csfrToken = JSONLocalStorage.get(LOCAL_STORAGE_CSRF_KEY);
    if (csfrToken) {
      try {
        const response = await apiClient.post(
          '/api/auth/retrieve-state',
          null,
          {
            headers: {
              'x-csrf-token': csfrToken,
            },
          }
        );

        if (response?.status !== 200) {
          throw new Error('Unauthorized');
        }

        this.inMemoryLoggedInState = response.data.state;
      } catch (e) {
        JSONLocalStorage.remove(LOCAL_STORAGE_CSRF_KEY);
      }
    }

    return this.inMemoryLoggedInState;
  }

  /**
   * Login state for static exported app
   */
  private async getStaticExportedAppLoggedInState(): Promise<LoggedInState | null> {
    return JSONLocalStorage.get(LOCAL_STORAGE_AUTH_KEY);
  }
}
