import { getSecretParameter } from '../aws/ParameterStore';

const SinunaSettings = {
  scope: 'openid frontend persistent_id', // The auth scope for Sinuna
  getSinunaSecrets: async () => {
    const stage = process.env.STAGE || 'local'; // @TODO: maybe use NODE_ENV instead, but translate to the vfd environment values
    return {
      sinunaClientId: await getSecretParameter(`${stage}_SINUNA_CLIENT_ID`),
      sinunaClientSecret: await getSecretParameter(
        `${stage}_SINUNA_CLIENT_SECRET`
      ),
    };
  },
  requests: {
    timeoutMs: 15000, // Timeout in 15 secs
    endpoints: {
      login: 'https://login.iam.qa.sinuna.fi/oxauth/restv1/authorize',
      token: 'https://login.iam.qa.sinuna.fi/oxauth/restv1/token',
      userInfo: 'https://login.iam.qa.sinuna.fi/oxauth/restv1/userinfo',
    },
  },
};

export default SinunaSettings;
