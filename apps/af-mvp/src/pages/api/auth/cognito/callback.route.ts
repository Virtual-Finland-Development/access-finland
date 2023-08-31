import { CognitoJwtVerifier } from "aws-jwt-verify";
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { object, parse, string } from 'valibot';

const CognitoLoginResponseSchema = object({
  id_token: string(),
  access_token: string(),
  expires_in: string(),
  token_type: string(),
  redirected_from_hash: string(),
});

function ifNotObjectOrEmptyObject(value: any): boolean {
  if (typeof value !== "object" || value === null || Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

/**
 * For AWS WAF & Cognition login, sets the access cookie and redirects to the root page
 * 
 * @param req 
 * @param res 
 * @returns 
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryParams = req.query;

  // A redirect hack to get the params from the url hash:
  // - AWS Cognito redirects to the callback with the params in the hash, nextjs doesn't parse the hash.
  // @see: https://stackoverflow.com/a/72071612
  if (ifNotObjectOrEmptyObject(queryParams)) {
    res.writeHead(302, { 'Content-Type': 'text/html' })
    res.write(`
        <script nonce="vfaf-${process.env.NEXT_PUBLIC_STAGE}">
            const queryString = window.location.hash.replace('#', '')
            window.location.href='${req.url}?redirected_from_hash=true&'+ queryString 
        </script>
    `)
    res.end();
    return res;
  }

  try {
    const cognitoLoginResponse = parse(CognitoLoginResponseSchema, queryParams);
    
    const userPoolId = process.env.WAF_USER_POOL_ID;
    const userPoolClientId = process.env.WAF_USER_POOL_CLIENT_ID;
    const sharedCookieSecret = process.env.WAF_SHARED_COOKIE_SECRET;
    
    // AWS Cognito verifier that expects valid access tokens
    const verifier = CognitoJwtVerifier.create({
      userPoolId: userPoolId,
      tokenUse: "id",
      clientId: userPoolClientId,
    });
    const payload = await verifier.verify(cognitoLoginResponse.id_token);

    // Success, redirect to the root page with the shared cookie
    res
      .setHeader('Set-Cookie', [
        cookie.serialize('cognito-identity.amazonaws.com', sharedCookieSecret, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          expires: new Date(payload.exp * 1000),
        }),
      ])
      .redirect(303, '/');
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message, trace: error.stack });
  }
};
