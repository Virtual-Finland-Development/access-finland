import { isPast, parseISO } from 'date-fns';
import { LoggedInState } from '@/types';
import { LoginState } from '../api/services/auth';

export async function getValidAuthState() {
  const storedAuthState = await LoginState.getLoggedInState();
  const tokenNotExpired = storedAuthState?.expiresAt
    ? !isPast(parseISO(storedAuthState.expiresAt))
    : false;
  return {
    isValid: storedAuthState !== null && tokenNotExpired,
    storedAuthState: storedAuthState as LoggedInState,
  };
}

export async function getUserIdentifier() {
  const loggedInState = await LoginState.getLoggedInState();

  if (!loggedInState) {
    throw new Error('No logged in state.');
  }

  return loggedInState.profileData.userId;
}
