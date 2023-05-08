import { rest } from 'msw';
import { PRH_MOCK_BASE_URL } from '@/lib/api/endpoints';
import { MOCK_AUTH_STATE, MOCK_USER_COMPANIES } from './mock-values';

const userId = MOCK_AUTH_STATE.storedAuthState.profileData.userId;

export const handlers = [
  rest.get(
    `${PRH_MOCK_BASE_URL}/users/${userId}/companies`,
    (req, res, ctx) => {
      return res(ctx.json(MOCK_USER_COMPANIES));
    }
  ),
];
