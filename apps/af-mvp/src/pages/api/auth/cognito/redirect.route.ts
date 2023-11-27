import { NextApiRequest, NextApiResponse } from 'next';

/**
 * If the waf-protection is enabled and the cognito session *is not valid* the WAF will redirect to the cognito login page instead,
 * otherwise this route is just a redirect to the root of the app.
 *
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  res
    .setHeader('Set-Cookie', ['Location=/'])
    .json({ message: 'Redirecting..' });
}

export default handler;
