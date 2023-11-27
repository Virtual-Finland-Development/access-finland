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
  const cleanupCookies = [
    cookie.serialize('cognitoVerify', '', {
      path: '/api',
      expires: new Date(0),
    }),
    cookie.serialize('wafCognitoSession', '', {
      path: '/',
      expires: new Date(0),
    }),
  ];

  const isJsonRequest = req.headers.accept?.includes('application/json');
  if (!isJsonRequest) {
    return res.status(302).setHeader('Set-Cookie', [
      'Location=/', // Redirect to the root page
      ...cleanupCookies,
    ]);
  }
  return res
    .setHeader('Set-Cookie', cleanupCookies)
    .json({ message: 'Session cleared' });
}

export default handler;
