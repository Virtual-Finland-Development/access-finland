import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

/**
 * Clear the cognito session cookies and redirect to the root page.
 * If the WAF-protection is enabled and the cognito session *is not valid* the WAF will redirect to the cognito login page instead
 *
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .setHeader('Set-Cookie', [
      'Location=/', // Redirect to the root page
      cookie.serialize('cognitoVerify', '', {
        path: '/api',
        expires: new Date(0),
      }),
      cookie.serialize('wafCognitoSession', '', {
        path: '/',
        expires: new Date(0),
      }),
    ])
    .json({ message: 'Redirecting..' });
}

export default handler;
