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
  res.setHeader('Set-Cookie', [
    cookie.serialize('cognitoVerify', '', {
      path: '/api',
      expires: new Date(0),
    }),
    cookie.serialize('wafCognitoSession', '', {
      path: '/',
      expires: new Date(0),
    }),
  ]);

  const isJsonRequest = req.headers.accept?.includes('application/json');
  if (!isJsonRequest) {
    return res.redirect(303, '/');
  }
  return res.json({ message: 'Session cleared' });
}

export default handler;
