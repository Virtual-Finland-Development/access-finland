import { NextApiRequest } from 'next';
import axios from 'axios';
import {
  generateBase64Hash,
  resolveRequestOriginUrl,
  transformExpiresInToExpiresAt_ISOString,
} from '../../utils';
import SinunaSettings from './sinuna-settings';

export async function retrieveSinunaLoginUrl(req: NextApiRequest) {
  const { sinunaClientId } = await SinunaSettings.getSinunaSecrets();
  const scope = SinunaSettings.scope;
  const state = 'bazz'; // @TODO: Create
  const redirectBackUrl = resolveRequestOriginUrl(
    req,
    '/api/auth/login-response'
  );

  const url = new URL(SinunaSettings.requests.endpoints.login);
  url.search = new URLSearchParams({
    client_id: sinunaClientId,
    response_type: 'code',
    scope: scope,
    state: state,
    redirect_uri: redirectBackUrl.toString(),
  }).toString();

  return url;
}

export async function getSinunaTokensWithLoginCode(loginCode: string) {
  const sinunaSecrets = await SinunaSettings.getSinunaSecrets();

  const response = await axios.post(
    SinunaSettings.requests.endpoints.token,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: loginCode,
      scope: SinunaSettings.scope,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          generateBase64Hash(
            `${sinunaSecrets.sinunaClientId}:${sinunaSecrets.sinunaClientSecret}`
          ),
      },
      timeout: SinunaSettings.requests.timeoutMs,
    }
  );

  console.log('getSinunaTokensWithLoginCode', response.data); // @TODO: conditionalize to debug

  return {
    accessToken: response.data.access_token,
    idToken: response.data.id_token,
    expiresAt: transformExpiresInToExpiresAt_ISOString(
      response.data.expires_in
    ),
  };
}

export async function getUserInfoWithAccessToken(
  accessToken: string
): Promise<{ email: string; userId: string }> {
  const response = await axios.get(SinunaSettings.requests.endpoints.userInfo, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: SinunaSettings.requests.timeoutMs,
  });

  console.log('getUserInfoWithAccessToken', response.data); // @TODO: conditionalize to debug

  return {
    email: response.data.email,
    userId: response.data.peristentId,
  };
}
