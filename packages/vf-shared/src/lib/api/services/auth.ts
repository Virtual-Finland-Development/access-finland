import { LoggedInState } from '@/types';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REDIRECT_KEY,
} from '@/lib/constants';
import { generateAppContextHash } from '@/lib/utils';
import { JSONLocalStorage } from '@/lib/utils/JSONStorage';
import apiClient from '../api-client';
import { AUTH_GW_BASE_URL } from '../endpoints';

export function directToAuthGwLogin(redirectPath?: string) {
  if (redirectPath) {
    JSONLocalStorage.set(LOCAL_STORAGE_REDIRECT_KEY, redirectPath);
  }

  window.location.assign(
    `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${generateAppContextHash()}`
  );
}

export function directToAuthGwLogout() {
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_KEY).idToken;
  JSONLocalStorage.clear();

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

  return response.data;
}
