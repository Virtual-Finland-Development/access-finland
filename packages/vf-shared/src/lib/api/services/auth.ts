import { LoggedInState } from '@/types';
import { SESSION_STORAGE_REDIRECT_KEY } from '@/lib/constants';
import { generateAppContextHash, isExportedApplication } from '@/lib/utils';
import { JSONSessionStorage } from '@/lib/utils/JSONStorage';
import { LoggedInStateMachine } from '@/lib/utils/LoggedInStateMachine';
import apiClient from '../api-client';
import { AUTH_GW_BASE_URL } from '../endpoints';

export const LoginState = new LoggedInStateMachine();

export function directToAuthGwLogin(redirectPath?: string) {
  if (redirectPath) {
    JSONSessionStorage.set(SESSION_STORAGE_REDIRECT_KEY, redirectPath);
  }

  if (isExportedApplication()) {
    window.location.assign(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${generateAppContextHash()}`
    );
  } else {
    window.location.assign('/api/auth/login');
  }
}

export async function directToAuthGwLogout() {
  if (isExportedApplication()) {
    const idToken = (await LoginState.getLoggedInState())?.idToken;

    // Cleanup internal state before redirecting to auth-gw
    await LoginState.clear();

    window.location.assign(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/logout-request?appContext=${generateAppContextHash()}&idToken=${idToken}`
    );
  } else {
    await logOut();
    window.location.reload(); // Update views with force
  }
}

export async function logIn(authPayload: {
  loginCode: string;
  appContext: string;
}): Promise<LoggedInState> {
  if (!isExportedApplication()) {
    throw new Error('logIn should not be called in non-exported applications');
  }

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

  const loggedInState = response.data;

  // Initialize internal state
  await LoginState.setLoggedInState(loggedInState);

  return loggedInState;
}

export async function logOut() {
  // clean up cookie for protected routes
  await apiClient.post('/api/auth/logout');
  // cleanup internal state, just in case called directly
  await LoginState.clear();
}
