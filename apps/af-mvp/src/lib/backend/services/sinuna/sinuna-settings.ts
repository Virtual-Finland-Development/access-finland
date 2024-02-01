import { getStagedSecretParameter } from '../../secrets-store';

const SinunaSettings = {
  scope: 'openid frontend persistent_id', // The auth scope for Sinuna
  getSinunaSecrets: async () => {
    return {
      sinunaClientId: await getStagedSecretParameter('SINUNA_CLIENT_ID'),
      sinunaClientSecret: await getStagedSecretParameter(
        'SINUNA_CLIENT_SECRET'
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
