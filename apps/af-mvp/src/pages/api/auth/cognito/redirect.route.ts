import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Redirect to app root, if the waf-protection is enabled and the cognito session is not valid the WAF will redirect to the cognito login page
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
