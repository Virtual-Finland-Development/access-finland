import { LoggedInState } from '@/types';
import { SESSION_STORAGE_REDIRECT_KEY } from '@/lib/constants';
import { generateAppContextHash, isExportedApplication } from '@/lib/utils';
import { LoggedInStateMachine } from '@/lib/utils/LoggedInStateMachine';
import apiClient from '../api-client';
import { AUTH_GW_BASE_URL } from '../endpoints';

export const LoginState = new LoggedInStateMachine();

export function directToAuthGwLogin(redirectPath?: string) {
  if (redirectPath) {
    window.sessionStorage.setItem(SESSION_STORAGE_REDIRECT_KEY, redirectPath);
  }

  window.location.assign(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${generateAppContextHash()}`
  );
}

export async function directToAuthGwLogout() {
  const idToken = (await LoginState.getLoggedInState())?.idToken;

  // Cleanup internal state before redirecting to auth-gw
  await LoginState.clear();

  window.location.assign(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/logout-request?appContext=${generateAppContextHash()}&idToken=${idToken}`
  );
}

export async function logIn(authPayload: {
  loginCode: string;
  appContext: string;
}): Promise<LoggedInState> {
  const response = await apiClient.post(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/login-request`,
    authPayload,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error('Error in login request');
  }

  let loggedInState = response.data;

  if (!isExportedApplication()) {
    // Setup cookie for protected api routes
    const vfApiAuthResponse = await apiClient.post(
      '/api/auth/login',
      loggedInState
    );

    if (vfApiAuthResponse?.status !== 200) {
      throw new Error('Error in backend login request');
    }

    loggedInState = vfApiAuthResponse.data.state;
  }

  // Initialize internal state
  await LoginState.setLoggedInState(loggedInState);

  return loggedInState;
}

export async function logOut() {
  // cleanup internal state, just in case called directly
  await LoginState.clear();
  // clean up cookie for protected routes
  await apiClient.post('/api/auth/logout');
}
